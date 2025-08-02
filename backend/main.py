from fastapi import FastAPI, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, RedirectResponse
from pydantic import BaseModel, Field
import os
from dotenv import load_dotenv
from supabase import create_client, Client
from reddit_scraper import RedditScraper
import urllib.parse
from urllib.parse import quote
import csv
from io import StringIO
from datetime import datetime, timezone
from routes.auth import router as auth_router

load_dotenv()

supabase_url = os.getenv("SUPABASE_PROJECT_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(supabase_url, supabase_key)
scraper = RedditScraper()

app = FastAPI()
app.include_router(auth_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://www.marketknowledge.app", "https://marketknowledge.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TIER_LIMITS = {
    "free": 500,
    "pro": 5000,
    "max": 100000,
}

def save_post_to_supabase(title, body, link, upvotes, subreddit, user_id, keyword=None):
    """Saves a Reddit post to Supabase. Returns nothing."""
    data = {
        "title": title,
        "body": body,
        "link": link,
        "upvotes": upvotes,
        "subreddit": subreddit,
        "keyword": keyword,
        "user_id": user_id
    }
    # print("\n\nSaving post to Supabase:", data, "\n\n")
    supabase.table("reddit_posts").insert(data).execute()

class ScrapeRequest(BaseModel):
    subreddit: str = Field(..., description="The name of the subreddit to scrape (without 'r/' prefix).")
    commentCount: int = Field(10, ge=1, le=100, description="The number of top posts to fetch (default is 10, max is 100).")
    method: str = Field("top", description="The method to fetch posts (e.g., 'top', 'hot', 'new'). Default is 'top'.")
    keyword: str = Field(None, description="Optional search query to filter posts. If provided, 'method' will be ignored.")
    sort: str = Field("relevance", description="Sort order for search results. Default is 'relevance'.")
    time_filter: str = Field("all", description="Time filter for search results. Default is 'all'.")
    user_id: str = Field("", description="The users unique id to attach to posts that are scraped. Default is ''.")

@app.post("/scrape")
def scrape_comments(req: ScrapeRequest):
    """
    Endpoint to scrape top posts from a specified subreddit.
    Accepts a JSON body with 'subreddit' and 'comments' parameters.
    Returns a list of top posts in JSON format.
    """

    # Ensure a user profile row exists for this user_id
    existing_profile = supabase.table("user_profiles").select("user_id").eq("user_id", req.user_id).execute()
    if not existing_profile.data or len(existing_profile.data) == 0:
        supabase.table("user_profiles").insert({"user_id": req.user_id, "tier": "free"}).execute()

    # Get the user's tier from user_profiles table
    profile = supabase.table("user_profiles").select("tier").eq("user_id", req.user_id).single().execute()
    user_tier = profile.data["tier"] if profile.data else "free"
    max_allowed = TIER_LIMITS.get(user_tier, 500)

    comment_count = supabase.table("reddit_posts").select("id", count="exact").eq("user_id", req.user_id).execute()
    current_count = comment_count.count if hasattr(comment_count, "count") else 0

    requested_count = req.commentCount
    if current_count + requested_count > max_allowed:
        return {
            "message": f"""Your current tier '{user_tier}' allows a maximum of {max_allowed} posts. You have already scraped {current_count} posts.
             Please export and delete some posts or upgrade to continue scraping"""
        }

    now = datetime.now(timezone.utc)
    # Fetch the user's last scrape time
    result = supabase.table("scrape_cooldowns").select("last_scrape").eq("user_id", req.user_id).execute()
    last_scrape = result.data[0]["last_scrape"] if result.data else None

    if last_scrape:
        last_scrape_dt = datetime.fromisoformat(last_scrape)
        if (now - last_scrape_dt).total_seconds() < 30:
            remaining_time = 30 - int((now - last_scrape_dt).total_seconds())
            return {"message": f"You can only scrape every 30 seconds. Please wait {remaining_time} seconds."}
        
    # Update or insert the last scrape timestamp
    if result.data:
        supabase.table("scrape_cooldowns").update({"last_scrape": now.isoformat()}).eq("user_id", req.user_id).execute()
    else:
        supabase.table("scrape_cooldowns").insert({"user_id": req.user_id, "last_scrape": now.isoformat()}).execute()

    profile = supabase.table("user_profiles").select("reddit_refresh_token").eq("user_id", req.user_id).single().execute()
    refresh_token = profile.data["reddit_refresh_token"] if profile.data else None

    if not refresh_token:
        return {"message": "Reddit account not connected. Please connect your Reddit account to scrape"}

    # Finally allow scrape if other tests pass
    # If searching by keyword
    if req.keyword:
        all_posts = scraper.fetch_posts(
            req.subreddit, 
            refresh_token=refresh_token,
            limit=req.commentCount, 
            query=req.keyword, 
            sort=req.sort, 
            time_filter=req.time_filter,
        )

    else:
        all_posts = scraper.fetch_posts(
            req.subreddit,
            refresh_token=refresh_token,
            limit=req.commentCount, 
            method=req.method, 
            )
        
    for post in all_posts:
        save_post_to_supabase(
            title=post["title"],
            body=post["body"],
            link=post["link"],
            upvotes=post["upvotes"],
            subreddit=req.subreddit,
            keyword=req.keyword,
            user_id=req.user_id,
        )
    
    if not all_posts:
        return {"message": f"No posts found for subreddit '{req.subreddit}'."}
    return {"all_posts": all_posts}

@app.get("/comments")
def get_comments(
    user_id: str = Query(..., description="Get comments that belong to the logged in user with their user_id."),
    filter: str = Query("relevance", description="Sort order by upvotes for the comments. Default is 'relevance'."),
):
    """
    Returns all scraped Reddit comments/posts from the Supabase database.
    """
    if filter == "relevance":
        result = supabase.table("reddit_posts").select("*").eq("user_id", user_id).execute()
    elif filter == "descending":
        result = supabase.table("reddit_posts").select("*").eq("user_id", user_id).order("upvotes", desc=True).execute()
    else:  #if filter == "ascending"
        result = supabase.table("reddit_posts").select("*").eq("user_id", user_id).order("upvotes", desc=False).execute()
    comments = result.data if hasattr(result, "data") else []
    return {"comments": comments}

@app.delete("/comments/{post_id}")
def delete_post(post_id):
    """
    Deletes a post from the Supabase database. 
    Returns the response from the delete operation.
    """
    response = supabase.table("reddit_posts").delete().eq("id", post_id).execute()
    return response

@app.get("/collections")
def get_collections():
    """
    Returns all collections from the database.
    """
    result = supabase.table("collections").select("*").execute()
    collections = result.data if hasattr(result, "data") else []
    return {"collections": collections}

class Collection(BaseModel):
    post_id: str = Field(..., description="The id of the post to add the collection to")
    collection: str = Field("Favorites", description="The collection to save the post to. Default is 'Favorites'")

@app.post("/save-to-collection")
def save_to_collection(req: Collection):
    """
    Takes a post id and a collection name. Adds the post to the new collection.
    """
    response = supabase.table("reddit_posts").select("collections").eq("id", req.post_id).single().execute()
    collections = response.data["collections"]
        
    if not collections: #No collections yet for this post
        collections = []

    if req.collection not in collections:
        collections.append(req.collection)
        supabase.table("reddit_posts").update({"collections": collections}).eq("id", req.post_id).execute()
        return {"message": "Collection added"}
    else: 
        return {"message": f"Post already in '{req.collection}'"}

@app.post("/remove-from-collection")
def remove_from_collection(req: Collection):
    """
    Takes a post id and a collection name. Removes the collection from the post.
    """
    response = supabase.table("reddit_posts").select("collections").eq("id", req.post_id).single().execute()
    collections = response.data["collections"]
    
    if req.collection in collections:
        collections.remove(req.collection)
        supabase.table("reddit_posts").update({"collections": collections}).eq("id", req.post_id).execute()
        return {"message": "Collection removed"}
    else:
        return {"message": "Collection not found on this post"}

class CollectionName(BaseModel): 
    collection_name: str = Field(..., description="The name of the collection to add or remove.")
    user_id: str = Field("", description="The user's unique id to attach to the collection. Default is ''.")

@app.post("/add-collection")
def add_collection(req: CollectionName): 
    """
    Takes a collection name as a string to add a collection. 
    """
    #first check if the name is already in the column, and if not, then add it. 
    response = supabase.table("collections").select("collection_names") \
        .eq("user_id", req.user_id) \
        .eq("collection_names", req.collection_name) \
        .execute()
    if response.data: 
        return {"message": "Collection name already exists!"}
    
    # collection_names = [row["collection_names"] for row in response.data]
    # print("Collections names is:", collection_names)
    # if req.collection_name in collection_names: 
    #     print("Did not add!")
    #     return {"message": "Collection name already exists!"}
    # else:
    slug = quote(req.collection_name, safe="")
    supabase.table("collections").insert({
        "collection_names": req.collection_name,
        "slug": slug,
        "user_id": req.user_id
        }).execute()
    print("Did add!")
    return {"message": "Collection added!"}

@app.delete("/delete-collection")
def remove_collection(req: CollectionName):
    """
    Takes a collection name and deletes the matching collection. 
    """
    response = supabase.table("collections") \
        .delete() \
        .eq("collection_names", req.collection_name) \
        .eq("user_id", req.user_id) \
        .execute()
    return response

class UserID(BaseModel):
    user_id: str = Field(..., description="The user's unique id to export comments for.")

@app.post("/export-comments")
def export_comments_csv(req: UserID):
    """
    Exports all comments from the Supabase unique to the user to a CSV file.
    """
    result = supabase.table("reddit_posts").select("*").eq("user_id", req.user_id).execute()
    comments = result.data if hasattr(result, "data") else []

    if not comments:
        return StreamingResponse(StringIO(""),
                                media_type="text/csv",
                                headers={"Content-Disposition": "attachment; filename=comments.csv"})
    #Dynamically get the fieldnames from the first comment
    # fieldnames = list(comments[0].keys())
    fieldnames = ["title", "body", "link", "upvotes", "subreddit", "keyword"]

    filtered_comments = [
        {key: comment.get(key, "") for key in fieldnames} for comment in comments
    ]

    #Use StringIO to write CSV in memory
    csv_file = StringIO()
    writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(filtered_comments)
    csv_file.seek(0)  # Reset the StringIO object to the beginning

    return StreamingResponse(
        csv_file,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=comments.csv"}
    )

@app.get("/health")
def health_check(): 
    return {"status": "ok"}


# For testing purposes, run the scraper directly. This just makes sure the scraper works first if there's any errors. 
if __name__ == "__main__":
    # hot_posts = scraper.fetch_posts("Anxiety", limit=10, method="top", query="Night")
    # for post in hot_posts:
    #     save_post_to_supabase(
    #         title=post["title"],
    #         body=post["body"],
    #         link=post["link"],
    #         upvotes=post["upvotes"],
    #         subreddit="Anxiety"
    #         )

    # remove_from_collection("8558ce46-b830-4adb-8e08-a30050b7a9b2", "Favorites")

    # remove_collection("martin")
    pass