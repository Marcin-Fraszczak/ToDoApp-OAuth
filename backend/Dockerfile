FROM python:3.11-alpine3.18
WORKDIR /backend
COPY ./requirements.txt ./requirements.txt
RUN pip install --no-cache-dir --upgrade -r ./requirements.txt
RUN pip install --upgrade --force-reinstall email-validator==2.0.0.post2
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]