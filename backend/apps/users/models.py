from typing import List

from pydantic import BaseModel, EmailStr, SecretStr, validator


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
		special_numbers = [i for i in range(33, 47)] + [i for i in range(58, 63)] \
						  + [i for i in range(91, 97)] + [i for i in range(123, 127)]
		specials = [chr(i) for i in special_numbers]
		errors = ''
		if len(password) < min_length:
			errors += 'Password must be at least 8 characters long. '
		if not any(character.islower() for character in password):
			errors += 'Password should contain at least one lowercase character.'
		if not any(character.isupper() for character in password):
			errors += 'Password should contain at least one uppercase character.'
		if not any(character.isdigit() for character in password):
			errors += 'Password should contain at least one digit.'
		if not any(character in specials for character in password):
			errors += 'Password should contain at least one digit or a special sign.'
		if errors:
			raise ValueError(errors)

		return value


class UserInDB(BaseUser):
	hashed_password: str
	refresh_token: str = ""
	active: bool = False
	verified: bool = False


class Email(BaseModel):
	email: List[EmailStr]
