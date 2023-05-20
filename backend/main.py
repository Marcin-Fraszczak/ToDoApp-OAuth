import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import docs
from apps.users.users import users
from apps.todos.todos import todos

app = FastAPI(
	title="ToDoApp - OAuth",
	description=docs.description,
	contact=docs.contact,
	openapi_tags=docs.tags_metadata,
)

app.include_router(users)
app.include_router(todos)

origins = [
	"http://localhost:3000",
	"http://127.0.0.1:3000",
	"http://localhost",
	"http://127.0.0.1",
]

app.add_middleware(
	CORSMiddleware,
	allow_origins=origins,
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

if __name__ == "__main__":
	load_dotenv('../.env')
	uvicorn.run("main:app", port=8000, reload=True)
	# uvicorn.run("main:app")
