from fastapi import HTTPException, status

invalid_credentials = HTTPException(
	status_code=status.HTTP_401_UNAUTHORIZED,
	detail={"msg": "Invalid credentials"},
	headers={"WWW-Authenticate": "Bearer"},
)

already_exists = HTTPException(
	status_code=status.HTTP_403_FORBIDDEN,
	detail={"msg": "User already exists"},
)

database_error = HTTPException(
	status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
	detail={"msg": "Error connection to a database"},
)

inactive_user = HTTPException(
	status_code=status.HTTP_400_BAD_REQUEST,
	detail={"msg": "Inactive user"}
)

invalid_id = HTTPException(
	status_code=status.HTTP_404_NOT_FOUND,
	detail={"msg": "Given id is invalid"}
)

not_found = HTTPException(
	status_code=status.HTTP_404_NOT_FOUND,
	detail={"msg": "Resource not found in database"}
)
