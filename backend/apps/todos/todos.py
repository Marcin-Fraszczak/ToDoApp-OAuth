from datetime import datetime
from fastapi import APIRouter, Depends, Request
from fastapi.security import OAuth2PasswordBearer
from bson.objectid import ObjectId
from typing import Annotated
from pymongo.errors import OperationFailure, ServerSelectionTimeoutError

from .models import BaseTask, Task, TaskInDB, ModifyTask, \
	BaseOperation, Operation, OperationInDB, ModifyOperation
from ..users import helpers as uf
from ..users.models import UserInDB
from ..common import HTTP_exceptions as exc
from ..common.db import tasks_db, operations_db

todos = APIRouter(
	prefix="/api/todos",
	tags=["todos"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/token")


def list_tasks(db, username) -> list[TaskInDB]:
	try:
		return [TaskInDB(**task, id=str(task.get("_id"))) for task in db.find({"owner": username}).sort('created', -1)]
	except (OperationFailure, ServerSelectionTimeoutError):
		raise exc.database_error


def list_operations(db, username, task_id) -> list[OperationInDB]:
	try:
		return [OperationInDB(**oper, id=str(oper.get("_id"))) for oper in db.find(
			{"owner": username, "task_id": str(task_id)}).sort('created', -1)]
	except (OperationFailure, ServerSelectionTimeoutError):
		raise exc.database_error


def strip_none_values(model: dict) -> dict:
	return {key: value for key, value in model.items() if value is not None}


def validate_id(task_id: str) -> ObjectId:
	try:
		return ObjectId(task_id)
	except:
		raise exc.invalid_id


@todos.get("/")
async def get_all_tasks(*, user: Annotated[UserInDB, Depends(uf.get_current_user)]) -> list[TaskInDB]:
	return list_tasks(tasks_db, user.username)


@todos.post("/")
async def add_new_task(*, user: Annotated[UserInDB, Depends(uf.get_current_user)], task: BaseTask) -> TaskInDB:
	try:
		new_task = Task(**task.dict(), owner=user.username, created=datetime.now())
		insert = tasks_db.insert_one(new_task.dict())
		return TaskInDB(**new_task.dict(), id=str(insert.inserted_id))
	except (OperationFailure, ServerSelectionTimeoutError):
		raise exc.database_error


@todos.put("/{task_id}")
async def modify_task(*, task_id: Annotated[str, Depends(validate_id)],
					  user: Annotated[UserInDB, Depends(uf.get_current_user)],
					  task: ModifyTask) -> TaskInDB:
	try:
		tasks_db.update_one(
			{"owner": user.username, "_id": task_id},
			{"$set": strip_none_values(task.dict())}
		)
		updated = tasks_db.find_one({"_id": task_id, "owner": user.username})
		return TaskInDB(**updated, id=str(updated.get("_id")))
	except (OperationFailure, ServerSelectionTimeoutError):
		raise exc.database_error


@todos.delete("/{task_id}")
async def delete_task(*, user: Annotated[UserInDB, Depends(uf.get_current_user)],
					  task_id: Annotated[str, Depends(validate_id)]) -> dict[str, str]:
	try:
		to_delete = tasks_db.find_one({"owner": user.username, "_id": task_id})
		if to_delete:
			deleted_operations = operations_db.delete_many({"owner": user.username, "task_id": str(task_id)})
			deleted = tasks_db.delete_one({"owner": user.username, "_id": task_id})
			return {"id": str(task_id), "deleted_operations": deleted_operations.deleted_count}
		raise exc.not_found
	except (OperationFailure, ServerSelectionTimeoutError):
		raise exc.database_error


@todos.get("/{task_id}/")
async def get_all_operations(*, user: Annotated[UserInDB, Depends(uf.get_current_user)],
							 task_id: Annotated[str, Depends(validate_id)]) -> list[OperationInDB]:
	return list_operations(operations_db, user.username, task_id)


@todos.post("/{task_id}/")
async def add_new_operation(*, user: Annotated[UserInDB, Depends(uf.get_current_user)],
							task_id: Annotated[str, Depends(validate_id)],
							operation: BaseOperation) -> OperationInDB:
	try:
		new_operation = Operation(**operation.dict(), owner=user.username, created=datetime.now(), task_id=str(task_id))
		insert = operations_db.insert_one(new_operation.dict())
		return OperationInDB(**new_operation.dict(), id=str(insert.inserted_id))
	except (OperationFailure, ServerSelectionTimeoutError):
		raise exc.database_error


@todos.put("/{task_id}/{oper_id}")
async def modify_operation(*, user: Annotated[UserInDB, Depends(uf.get_current_user)],
						   task_id: Annotated[str, Depends(validate_id)],
						   oper_id: str, operation: ModifyOperation) -> OperationInDB:
	oper_id = validate_id(oper_id)
	try:
		operations_db.update_one(
			{"owner": user.username, "_id": oper_id, "task_id": str(task_id)},
			{"$set": strip_none_values(operation.dict())}
		)
		updated = operations_db.find_one({"_id": oper_id, "owner": user.username, "task_id": str(task_id)})
		return OperationInDB(**updated, id=str(updated.get("_id")))
	except (OperationFailure, ServerSelectionTimeoutError):
		raise exc.database_error


@todos.delete("/{task_id}/{oper_id}")
async def delete_operation(*, user: Annotated[UserInDB, Depends(uf.get_current_user)],
						   task_id: Annotated[str, Depends(validate_id)],
						   oper_id: str, ) -> dict[str, str]:
	oper_id = validate_id(oper_id)
	try:
		deleted = operations_db.delete_one({"owner": user.username, "_id": oper_id, "task_id": str(task_id)})
		if deleted.deleted_count == 1:
			return {"id": str(oper_id)}
		else:
			raise exc.not_found
	except (OperationFailure, ServerSelectionTimeoutError):
		raise exc.database_error
