from fastapi import APIRouter, Request
import os
from fastapi.responses import RedirectResponse
import urllib.parse
import requests
from supabase import create_client

router = APIRouter()

supabase = create_client(os.getenv("SUPABASE_PROJECT_URL"), os.getenv("SUPABASE_SERVICE_ROLE_KEY"))

@router.get("/reddit/login")
def reddit_login(user_id: str):
    client_id = os.getenv("REDDIT_CLIENT_ID")
    redirect_uri = os.getenv("REDDIT_REDIRECT_URI")
    scope = "read"
    state = user_id # CHANGE when in production
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
    state = request.query_params.get("state")  # This is the user_id

    # Exchange code for tokens with Reddit
    client_id = os.getenv("REDDIT_CLIENT_ID")
    client_secret = os.getenv("REDDIT_CLIENT_SECRET")
    redirect_uri = os.getenv("REDDIT_REDIRECT_URI")
    auth = requests.auth.HTTPBasicAuth(client_id, client_secret)
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": redirect_uri
    }
    headers = {"User-Agent": "MarketKnowledge/0.0.1"}
    response = requests.post(
        "https://www.reddit.com/api/v1/access_token",
        auth=auth,
        data=data,
        headers=headers
    )

    # Make sure the call succeeded!
    if response.status_code != 200:
        print("Failed to get tokens from Reddit:", response.text)
        return RedirectResponse("https://marketknowledge.app/login?error=reddit_oauth_failed")

    tokens = response.json()
    refresh_token = tokens.get("refresh_token")
    access_token = tokens.get("access_token")

    # Save tokens directly in Supabase for this user
    if state and refresh_token:
        supabase.table("user_profiles").update({
            "reddit_refresh_token": refresh_token,
            "reddit_access_token": access_token,
        }).eq("user_id", state).execute()

    # Redirect the user back to your frontend, without sending tokens
    frontend_url = "http://marketknowledge.app"  # or wherever you want
    return RedirectResponse(frontend_url)

@router.post("/reddit/save_tokens")
async def save_reddit_tokens(request: Request):
    body = await request.json()
    user_id = body.get("user_id")
    refresh_token = body.get("refresh_token")
    access_token = body.get("access_token")

    if not user_id or not refresh_token:
        return {"error": "Missing user_id"}
    
    result = supabase.table("user_profiles").update({
        "reddit_refresh_token": refresh_token,
        "reddit_access_token": access_token,
    }).eq("user_id", user_id).execute()

    if result.error:
        return {"error": result.error.message}

    return {"message": "Tokens saved successfully"}