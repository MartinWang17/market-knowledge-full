from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import os
from dotenv import load_dotenv
from supabase import create_client, Client
from reddit_scraper import RedditScraper

load_dotenv()

supabase_url = os.getenv("SUPABASE_PROJECT_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(supabase_url, supabase_key)
scraper = RedditScraper()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def save_post_to_supabase(title, body, link, upvotes, subreddit, keyword=None):
    """Saves a Reddit post to Supabase. Returns nothing."""
    data = {
        "title": title,
        "body": body,
        "link": link,
        "upvotes": upvotes,
        "subreddit": subreddit,
        "keyword": keyword,
    }
    print("\n\nSaving post to Supabase:", data, "\n\n")
    supabase.table("reddit_posts").insert(data).execute()

class ScrapeRequest(BaseModel):
    subreddit: str = Field(..., description="The name of the subreddit to scrape (without 'r/' prefix).")
    commentCount: int = Field(10, ge=1, le=100, description="The number of top posts to fetch (default is 10, max is 100).")
    method: str = Field("top", description="The method to fetch posts (e.g., 'top', 'hot', 'new'). Default is 'top'.")
    keyword: str = Field(None, description="Optional search query to filter posts. If provided, 'method' will be ignored.")
    sort: str = Field("relevance", description="Sort order for search results. Default is 'relevance'.")
    time_filter: str = Field("all", description="Time filter for search results. Default is 'all'.")

@app.post("/scrape")
def scrape_comments(req: ScrapeRequest):
    """
    Endpoint to scrape top posts from a specified subreddit.
    Accepts a JSON body with 'subreddit' and 'comments' parameters.
    Returns a list of top posts in JSON format.
    """
    # If searching by keyword
    if req.keyword:
        all_posts = scraper.fetch_posts(
            req.subreddit, 
            limit=req.commentCount, 
            query=req.keyword, 
            sort=req.sort, 
            time_filter=req.time_filter
        )

    else:
        all_posts = scraper.fetch_posts(req.subreddit, req.commentCount, req.method)
    for post in all_posts:
        save_post_to_supabase(
            title=post["title"],
            body=post["body"],
            link=post["link"],
            upvotes=post["upvotes"],
            subreddit=req.subreddit,
            keyword=req.keyword
        )
    
    if not all_posts:
        return {"message": f"No posts found for subreddit '{req.subreddit}'."}
    return {"all_posts": all_posts}

@app.get("/comments")
def get_comments(
    filter: str = Query("relevance", description="Sort order by upvotes for the comments. Default is 'relevance'."),
):
    """
    Returns all scraped Reddit comments/posts from the Supabase database.
    """
    if filter == "relevance":
        result = supabase.table("reddit_posts").select("*").execute()
    elif filter == "descending":
        result = supabase.table("reddit_posts").select("*").order("upvotes", desc=True).execute()
    else:  #if filter == "ascending"
        result = supabase.table("reddit_posts").select("*").order("upvotes", desc=False).execute()
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
    Takes a post id and a collection name. Removes the collection from the post. Returns nothing. 
    """
    response = supabase.table("reddit_posts").select("collections").eq("id", req.post_id).single().execute()
    collections = response.data["collections"]
    
    if req.collection in collections:
        collections.remove(req.collection)
        supabase.table("reddit_posts").update({"collections": collections}).eq("id", req.post_id).execute()
        return {"message": "Collection removed"}
    else:
        return {"message": "Collection not found on this post"}


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
    remove_from_collection("8558ce46-b830-4adb-8e08-a30050b7a9b2", "Favorites")
