from os import getenv
from pymongo import MongoClient

mongo_uri = getenv("MONGODB_CONNECTION_STRING")
client = MongoClient(mongo_uri, serverSelectionTimeoutMS=2000)

db = client['todos']
users_db = db['users']
tasks_db = db['tasks']
operations_db = db['operations']
