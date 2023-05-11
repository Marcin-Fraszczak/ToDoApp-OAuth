from os import getenv
from typing import Annotated
from fastapi import Depends, APIRouter, Response, Request
from fastapi.security import OAuth2PasswordRequestForm

from . import functions_users as uf
from ..common.models import User, Token
from ..common.db import users_db
from ..common import HTTP_exceptions as exc

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
	# response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=True, samesite='none')

	return {"access_token": access_token, "token_type": "bearer"}


@users.get("/token/refresh", response_model=Token)
async def refresh_access_token(request: Request):
	refresh_token = request.cookies.get("refresh_token")
	user = await uf.get_current_user(refresh_token)
	if user.username:
		access_token = uf.create_token(user.username, expires_delta=int(ACCESS_TOKEN_EXPIRES))
		return {"access_token": access_token, "token_type": "bearer"}
	else:
		raise exc.invalid_credentials


@users.get("/logout")
async def logout_user(*, response: Response, request: Request):
	refresh_token = request.cookies.get("refresh_token")
	user = await uf.get_current_user(refresh_token)

	if user.username:
		response.delete_cookie("refresh_token")
		if uf.delete_refresh_token(user.username):
			return {"Successfully logged out"}
	raise exc.invalid_credentials
