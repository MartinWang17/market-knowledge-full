from fastapi import FastAPI
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
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScrapeRequest(BaseModel):
    subreddit: str = Field(..., description="The name of the subreddit to scrape (without 'r/' prefix).")
    commentCount: int = Field(10, ge=1, le=100, description="The number of top posts to fetch (default is 10, max is 100).")

@app.post("/scrape")
def scrape_comments(req: ScrapeRequest):
    """
    Endpoint to scrape top posts from a specified subreddit.
    Accepts a JSON body with 'subreddit' and 'comments' parameters.
    Returns a list of top posts in JSON format.
    """
    top_posts = scraper.fetch_top_posts(req.subreddit, req.commentCount)
    for post in top_posts:
        save_post_to_supabase(
            title=post["title"],
            body=post["body"],
            link=post["link"],
            upvotes=post["upvotes"],
            subreddit=req.subreddit
        )
    
    if not top_posts:
        return {"message": f"No posts found for subreddit '{req.subreddit}'."}
    return {"top_posts": top_posts}

@app.get("/comments")
def get_comments():
    """
    Returns all scraped Reddit comments/posts from the Supabase database.
    """
    result = supabase.table("reddit_posts").select("*").execute()
    comments = result.data if hasattr(result, "data") else []
    return {"comments": comments}

def save_post_to_supabase(title, body, link, upvotes, subreddit):
    """Saves a Reddit post to Supabase. Returns nothing."""
    data = {
        "title": title,
        "body": body,
        "link": link,
        "upvotes": upvotes,
        "subreddit": subreddit
    }
    supabase.table("reddit_posts").insert(data).execute()

# For testing purposes, run the scraper directly. This just makes sure the scraper works first if there's any errors. 
if __name__ == "__main__":
    top_posts = scraper.fetch_top_posts("cats", limit=2)
    for post in top_posts:
        save_post_to_supabase(
            title=post["title"],
            body=post["body"],
            link=post["link"],
            upvotes=post["upvotes"],
            subreddit=post["subreddit"]
            )
