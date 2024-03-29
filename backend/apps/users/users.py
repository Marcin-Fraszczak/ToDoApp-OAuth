from os import getenv
from typing import Annotated

from email_validator import validate_email
from fastapi import Depends, APIRouter, Response, Request, BackgroundTasks, Body
from fastapi.security import OAuth2PasswordRequestForm
from pymongo.errors import OperationFailure, ServerSelectionTimeoutError

from . import helpers as uf
from .models import User, Token, UserInDB, Email, BaseUser
from ..common.db import users_db
from ..common import HTTP_exceptions as exc
from .email import send_in_background

ACCESS_TOKEN_EXPIRES = getenv("ACCESS_TOKEN_LIFETIME_SECONDS", 30)
REFRESH_TOKEN_EXPIRES = getenv("REFRESH_TOKEN_LIFETIME_SECONDS", 3600)

users = APIRouter(
	prefix="/users",
	tags=["users"]
)


@users.post("/")
async def register_user(*, user: User, background_tasks: BackgroundTasks):
	user.username = validate_email(user.username, check_deliverability=False).normalized
	new_user = await uf.add_user_to_db(users_db, user)
	await send_in_background(background_tasks, Email(email=[user.username, ]), email_type="verification")
	return new_user


@users.post("/verify")
async def send_verification_email(*, background_tasks: BackgroundTasks,
								  user: Annotated[UserInDB, Depends(uf.get_current_user)]):
	if user.verified:
		raise exc.already_verified
	await send_in_background(background_tasks, Email(email=[user.username, ]), email_type="verification")
	return {"username": user.username}


@users.get("/verify")
async def verify_account(token: str | None = None):
	user = await uf.get_current_user(token)
	if user.verified:
		raise exc.inactive_token
	try:
		users_db.update_one({"username": user.username}, {"$set": {"verified": True}})
		user = UserInDB(**users_db.find_one({"username": user.username}))
		return {"username": user.username, "verified": user.verified}
	except (OperationFailure, ServerSelectionTimeoutError):
		raise exc.database_error


@users.post("/token", response_model=Token)
async def login_for_access_token(*, response: Response,
								 form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
	email = validate_email(form_data.username, check_deliverability=False).normalized
	user = await uf.authenticate_user(users_db, email, form_data.password)
	if not user:
		raise exc.invalid_credentials

	access_token = uf.create_token(user.username, expires_delta=int(ACCESS_TOKEN_EXPIRES), verified=user.verified)
	refresh_token = uf.create_token(user.username, expires_delta=int(REFRESH_TOKEN_EXPIRES), verified=user.verified)

	users_db.update_one({"username": user.username}, {"$set": {"refresh_token": refresh_token}})
	response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=True, samesite='none')

	return {"access_token": access_token, "token_type": "bearer"}


@users.get("/token/refresh", response_model=Token)
async def refresh_access_token(request: Request):
	refresh_token = request.cookies.get("refresh_token")
	if not refresh_token:
		raise exc.invalid_credentials
	user = await uf.get_current_user(refresh_token)
	if user.username:
		access_token = uf.create_token(user.username, expires_delta=int(ACCESS_TOKEN_EXPIRES), verified=user.verified)
		return {"access_token": access_token, "token_type": "bearer"}
	else:
		raise exc.invalid_credentials


@users.post("/logout")
async def logout_user(*, response: Response, request: Request):
	refresh_token = request.cookies.get("refresh_token")
	if refresh_token:
		response.delete_cookie("refresh_token")
		updated = users_db.update_many({"refresh_token": refresh_token}, {"$set": {"refresh_token": ""}})
	return {"logged out"}


@users.post("/password_reset", status_code=202)
async def reset_users_password(*, user: BaseUser, background_tasks: BackgroundTasks):
	user_in_db = await uf.get_user(users_db, user.username)
	if user_in_db:
		await send_in_background(background_tasks, Email(email=[user.username, ]), email_type="reset")
	return {"sent"}


@users.put("/password_reset")
async def set_new_users_password(*, token: str | None = None, password: Annotated[str, Body()]):
	user = await uf.get_current_user(token)
	new_user = User(username=user.username, password=password)
	new_hashed_password = uf.get_password_hash(password)
	try:
		users_db.update_one({"username": user.username}, {"$set": {"hashed_password": new_hashed_password}})
		user = UserInDB(**users_db.find_one({"username": user.username}))
		return {"username": user.username}
	except (OperationFailure, ServerSelectionTimeoutError):
		raise exc.database_error


@users.put("/me")
async def change_password(*, user: Annotated[UserInDB, Depends(uf.get_current_user)], response: Response,
						  password: Annotated[str, Body()], password1: Annotated[str, Body()]):
	if not uf.verify_password(password, user.hashed_password):
		raise exc.wrong_password
	if not password1:
		raise exc.passwords_dont_match
	try:
		updated = users_db.update_one({"username": user.username},
									  {"$set":
										  {
											  "hashed_password": uf.get_password_hash(password1),
											  "refresh_token": ""
										  }
									  })
		if updated.matched_count == 1:
			response.delete_cookie("refresh_token")
			return {"success": "ok"}
		else:
			raise exc.not_found
	except (OperationFailure, ServerSelectionTimeoutError):
		raise exc.database_error


@users.delete("/me")
async def delete_user(*, user: Annotated[UserInDB, Depends(uf.get_current_user)], response: Response):
	deleted = uf.delete_all_users_todos(user.username)
	users_db.delete_one({"username": user.username})
	response.delete_cookie("refresh_token")
	return {"username": user.username}
