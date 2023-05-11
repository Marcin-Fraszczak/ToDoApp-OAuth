from pydantic import BaseModel, EmailStr, validator, Field
from datetime import datetime
from bson.objectid import ObjectId
from bson.errors import InvalidId


def validate_id(value):
	try:
		ObjectId(value)
		return value
	except InvalidId:
		raise ValueError(
			f'{value} is not a valid ObjectId, it must be a 12-byte input or a 24-character hex string')


class BaseTask(BaseModel):
	title: str = Field(min_length=3)
	description: str = ""


class Task(BaseTask):
	owner: EmailStr
	created: datetime


class TaskInDB(Task):
	id: str
	finished: bool = False

	_validate_id = validator('id', allow_reuse=True)(validate_id)


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

	_validate_id = validator('task_id', allow_reuse=True)(validate_id)


class OperationInDB(Operation):
	id: str
	finished: bool = False
	time: int = 0

	_validate_id = validator('id', allow_reuse=True)(validate_id)


class ModifyOperation(BaseModel):
	title: str | None = Field(None, min_length=3)
	time: int | None = None
	finished: bool | None = None
