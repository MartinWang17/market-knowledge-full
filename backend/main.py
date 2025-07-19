from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
import os
from dotenv import load_dotenv
from supabase import create_client, Client
from reddit_scraper import RedditScraper
from urllib.parse import quote
import csv
from io import StringIO

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
    # If searching by keyword
    if req.keyword:
        all_posts = scraper.fetch_posts(
            req.subreddit, 
            limit=req.commentCount, 
            query=req.keyword, 
            sort=req.sort, 
            time_filter=req.time_filter,
            user_id=req.user_id,
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
            keyword=req.keyword,
            user_id=req.user_id,
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
    #is this the correct way to get all comments for a specific user?
    result = supabase.table("reddit_posts").select("*").eq("user_id", req.user_id).execute()
    comments = result.data if hasattr(result, "data") else []

    if not comments:
        return StreamingResponse(StringIO(""),
                                media_type="text/csv",
                                headers={"Content-Disposition": "attachment; filename=comments.csv"})
    #Dynamically get the fieldnames from the first comment
    fieldnames = list(comments[0].keys())

    #Use StringIO to write CSV in memory
    csv_file = StringIO()
    writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(comments)
    csv_file.seek(0)  # Reset the StringIO object to the beginning

    return StreamingResponse(
        csv_file,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=comments.csv"}
    )



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