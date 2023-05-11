from pydantic import BaseModel, EmailStr, SecretStr, validator, Field
from datetime import datetime
from bson.objectid import ObjectId
from bson.errors import InvalidId


class Token(BaseModel):
	access_token: str
	token_type: str


class BaseUser(BaseModel):
	username: EmailStr


class User(BaseUser):
	password: SecretStr

	@validator('password', always=True)
	def validate_password(cls, value):
		password = value.get_secret_value()
		min_length = 8
		special_numbers = [i for i in range(33, 65)] + [i for i in range(91, 97)] + [i for i in range(123, 127)]
		specials = [chr(i) for i in special_numbers]
		errors = ''
		if len(password) < min_length:
			errors += 'Password must be at least 8 characters long. '
		if not any(character.islower() for character in password):
			errors += 'Password should contain at least one lowercase character.'
		if not any(character.isupper() for character in password):
			errors += 'Password should contain at least one uppercase character.'
		if not any(character in specials for character in password):
			errors += 'Password should contain at least one digit or a special sign.'
		if errors:
			raise ValueError(errors)

		return value


class UserInDB(BaseUser):
	hashed_password: str
	refresh_token: str = ""
	active: bool = False


class BaseTask(BaseModel):
	title: str = Field(min_length=3)
	description: str = ""


class Task(BaseTask):
	owner: EmailStr
	created: datetime


class TaskInDB(Task):
	id: str
	finished: bool = False

	@validator('id', always=True)
	def validate_token(cls, value):
		try:
			ObjectId(value)
		except InvalidId:
			raise ValueError(
				f'{value} is not a valid ObjectId, it must be a 12-byte input or a 24-character hex string')
		return value


class ModifyTask(BaseModel):
	title: str | None = Field(None, min_length=3)
	description: str | None = None
	finished: bool | None = None


class BaseOperation(BaseModel):
	title: str = Field(min_length=3)


class Operation(BaseOperation):
	owner: EmailStr
	created: datetime
	task_id: str

	@validator('task_id', always=True)
	def validate_token(cls, value):
		try:
			ObjectId(value)
		except InvalidId:
			raise ValueError(
				f'{value} is not a valid ObjectId, it must be a 12-byte input or a 24-character hex string')
		return value


class OperationInDB(Operation):
	id: str
	finished: bool = False
	time: int = 0

	@validator('id', always=True)
	def validate_token(cls, value):
		try:
			ObjectId(value)
		except InvalidId:
			raise ValueError(
				f'{value} is not a valid ObjectId, it must be a 12-byte input or a 24-character hex string')
		return value


class ModifyOperation(BaseModel):
	title: str | None = Field(None, min_length=3)
	time: int | None = None
	finished: bool | None = None
