from os import getenv
from typing import Annotated
from fastapi import Depends, APIRouter, Response, Request
from fastapi.security import OAuth2PasswordRequestForm
from pymongo.errors import OperationFailure, ServerSelectionTimeoutError

from . import helpers as uf
from .models import User, Token, UserInDB
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
async def register_user(user: User):
	new_user = await uf.add_user_to_db(users_db, user)
	return new_user


@users.post("/token", response_model=Token)
async def login_for_access_token(*, response: Response,
								 form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
	user = await uf.authenticate_user(users_db, form_data.username, form_data.password)
	if not user:
		raise exc.invalid_credentials

	access_token = uf.create_token(user.username, expires_delta=int(ACCESS_TOKEN_EXPIRES))
	refresh_token = uf.create_token(user.username, expires_delta=int(REFRESH_TOKEN_EXPIRES))

	users_db.update_one({"username": user.username}, {"$set": {"refresh_token": refresh_token}})
	response.set_cookie(key="refresh_token", value=refresh_token, httponly=True)
	# TODO: uncomment this line when working with React frontend
	# response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=True, samesite='none')

	return {"access_token": access_token, "token_type": "bearer"}


@users.get("/token/refresh", response_model=Token)
async def refresh_access_token(request: Request):
	refresh_token = request.cookies.get("refresh_token")
	if not refresh_token:
		raise exc.invalid_credentials
	user = await uf.get_current_user(refresh_token)
	if user.username:
		access_token = uf.create_token(user.username, expires_delta=int(ACCESS_TOKEN_EXPIRES))
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


@users.put("/me")
async def change_password(*, user: Annotated[UserInDB, Depends(uf.get_current_user)],
						  request: Request, response: Response):
	body = await request.json()
	if not uf.verify_password(body.get("password"), user.hashed_password):
		raise exc.wrong_password
	pass1, pass2 = body.get("password1"), body.get("password2")
	if not (pass1 and pass2 and pass1 == pass2):
		raise exc.passwords_dont_match
	try:
		updated = users_db.update_one({"username": user.username},
									  {"$set":
										  {
											  "hashed_password": uf.get_password_hash(pass1),
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


from fastapi.responses import JSONResponse
from fastapi import BackgroundTasks
from .models import Email


@users.post("/emailbackground")
async def send_in_bg(background_tasks: BackgroundTasks, email: Email) -> JSONResponse:
	return await send_in_background(background_tasks, email)
