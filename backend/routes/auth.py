from fastapi import APIRouter, Request
import os
from fastapi.responses import RedirectResponse
import urllib.parse
import requests

router = APIRouter()


@router.get("/reddit/login")
def reddit_login():
    client_id = os.getenv("REDDIT_CLIENT_ID")
    redirect_uri = os.getenv("REDDIT_REDIRECT_URI")
    scope = "read"
    state = "random_state_string" # CHANGE when in production
    params = {
        "client_id": client_id,
        "response_type": "code",
        "state": state,
        "redirect_uri": redirect_uri,
        "duration": "permanent", # to obtain a refresh token
        "scope": scope,
    }
    url = f"https://www.reddit.com/api/v1/authorize?{urllib.parse.urlencode(params)}"
    return RedirectResponse(url)

@router.get("/reddit/oauth/callback")
async def reddit_callback(request: Request):
    code = request.query_params.get("code")
    state = request.query_params.get("state")

    # Exchange code for tokens
    auth = requests.auth.HTTPBasicAuth(
        os.getenv("REDDIT_CLIENT_ID"), os.getenv("REDDIT_CLIENT_SECRET")
    )
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": os.getenv("REDDIT_REDIRECT_URI"),
    }
    headers = {"User-Agent": "MarketKnowledge/0.0.1"}
    response = requests.post(
        "https://www.reddit.com/api/v1/access_token",
        auth=auth,
        data=data,
        headers=headers,
    )
    tokens = response.json()
    refresh_token = tokens.get("refresh_token")
    access_token = tokens.get("access_token")

    # For now, just print them (later, save refresh_token to Supabase with user_id)
    print("Refresh token:", refresh_token)
    print("Access token:", access_token)

    return {"refresh_token": refresh_token, "access_token": access_token}