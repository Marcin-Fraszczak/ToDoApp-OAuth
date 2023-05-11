from os import getenv
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
from pymongo.errors import OperationFailure, ServerSelectionTimeoutError
from pydantic import EmailStr

from .models import BaseUser, UserInDB
from ..common import HTTP_exceptions as exc
from ..common.db import users_db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/token")

SECRET_KEY = getenv("SECRET_KEY")
ALGORITHM = "HS256"


def verify_password(plain_password, hashed_password):
	return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
	return pwd_context.hash(password)


def create_token(username: EmailStr, expires_delta: int | None = None):
	if not expires_delta:
		expires_delta = 30
	expire = datetime.utcnow() + timedelta(seconds=expires_delta)
	to_encode = {"sub": username, "exp": expire}
	encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
	return encoded_jwt


async def get_user(db, username: str):
	user = db.find_one({"username": username})
	if user:
		return UserInDB(**user)


async def authenticate_user(db, username: str, password: str):
	user = await get_user(db, username)
	if not user:
		return False
	if not verify_password(password, user.hashed_password):
		return False
	return user


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
	try:
		payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
		username: str = payload.get("sub")
		if username is None:
			raise exc.invalid_credentials
	except JWTError:
		raise exc.invalid_credentials
	user = await get_user(users_db, username=username)
	if user is None:
		raise exc.invalid_credentials
	return user


async def get_current_active_user(
		current_user: Annotated[UserInDB, Depends(get_current_user)]
):
	if not current_user.active:
		raise exc.inactive_user
	return current_user


async def add_user_to_db(db, user):
	exists = await get_user(db, user.username)
	if exists:
		raise exc.already_exists
	try:
		new_user = db.insert_one({
			"username": user.username,
			"hashed_password": get_password_hash(user.password.get_secret_value()),
			"active": True,
			"refresh_token": "",
		})
		if new_user.inserted_id:
			return BaseUser(username=user.username)
		raise exc.database_error
	except (OperationFailure, ServerSelectionTimeoutError):
		raise exc.database_error


def delete_refresh_token(username: EmailStr):
	try:
		updated = users_db.update_one({"username": username}, {"$set": {"refresh_token": ""}})
		return updated.modified_count
	except (OperationFailure, ServerSelectionTimeoutError):
		raise exc.database_error
