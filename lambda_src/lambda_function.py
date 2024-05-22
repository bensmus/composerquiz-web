import os
import requests # Installed using `pip install requests -t .`
import json

def get_spotify_token() -> str:
    spotify_token_url = 'https://accounts.spotify.com/api/token'
    response = requests.post(spotify_token_url, {
        'grant_type': 'client_credentials',
        'client_id': os.getenv('client_id'),
        'client_secret': os.getenv('client_secret'),
    })
    return response.json()['access_token']

def lambda_handler(event, context):
    token = get_spotify_token()
    return {
        'statusCode': 200,
        'body': token
    }
