from os import getenv
from pathlib import Path
from dotenv import load_dotenv
from datetime import datetime, timedelta
from fastapi import BackgroundTasks
from fastapi.responses import JSONResponse
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from .models import Email
from .helpers import create_token

load_dotenv('.env')

conf = ConnectionConfig(
	MAIL_USERNAME=getenv("MAIL_USERNAME"),
	MAIL_PASSWORD=getenv("MAIL_PASSWORD"),
	MAIL_FROM=getenv("MAIL_FROM"),
	MAIL_PORT=getenv("MAIL_PORT"),
	MAIL_SERVER=getenv("MAIL_SERVER"),
	MAIL_FROM_NAME=getenv("MAIL_FROM_NAME"),
	MAIL_STARTTLS=getenv("MAIL_STARTTLS", True),
	MAIL_SSL_TLS=getenv("MAIL_SSL_TLS", False),
	USE_CREDENTIALS=getenv("USE_CREDENTIALS", True),
	VALIDATE_CERTS=getenv("VALIDATE_CERTS", True),
	TEMPLATE_FOLDER=Path(__file__).parent / 'templates'
)


async def send_in_background(
		background_tasks: BackgroundTasks, email: Email, email_type: str = "verification") -> JSONResponse:
	all_recipients = email.dict().get("email")
	recipient = all_recipients[0]
	expires_seconds = 3600

	# TODO: make it a dynamic url
	url = f"http://127.0.0.1:3000/verify?token={create_token(recipient, expires_seconds)}"
	exp = (datetime.utcnow() + timedelta(seconds=expires_seconds)).strftime("%Y/%m/%d  %H:%M:%S")

	message = MessageSchema(
		subject="ToDoApp Account Verification",
		recipients=[recipient, ],
		template_body={"email": recipient, "url": url, "exp": exp},
		subtype=MessageType.html
	)

	fm = FastMail(conf)

	background_tasks.add_task(fm.send_message, message, template_name=f"{email_type}_email.html")

	return JSONResponse(status_code=202, content={"message": "email has been sent"})
