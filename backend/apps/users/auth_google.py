from os import getenv
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config


GOOGLE_CLIENT_ID = getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = getenv('GOOGLE_CLIENT_SECRET')

config_data = {'GOOGLE_CLIENT_ID': GOOGLE_CLIENT_ID, 'GOOGLE_CLIENT_SECRET': GOOGLE_CLIENT_SECRET}
starlette_config = Config(environ=config_data)
oauth = OAuth(starlette_config)
oauth.register(
    name='google',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'},
)
