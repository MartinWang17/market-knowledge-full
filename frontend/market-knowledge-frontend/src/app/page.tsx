"use client";
import { useState } from 'react';
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {

  const [subreddit, setSubreddit] = useState("");
  const [commentCount, setCommentCount] = useState(10);
  const [method, setMethod] = useState("top");
  const handleScrape = async () => {
    console.log("Scraping comments from subreddit:", subreddit);
    console.log("Number of comments to scrape:", commentCount);
    console.log("Scrape method:", method);

    try {
      const response = await fetch("http://localhost:8000/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subreddit: subreddit,
          commentCount: commentCount,
          method: method,
        }),
      });

      //parse the JSON response
      const data = await response.json()
      console.log("Scrape response:", data);
    } catch (error) {
      console.error("Error scraping comments:", error);
    }
    // Reset the input fields after scraping
    setSubreddit("");
    setCommentCount(10);
  }
  
  return (
    <div className="d-flex flex-column justify-content-center align-items-center"
         style={{ width: "100vw"}}>
      <div className="mb-1 d-flex justify-content-center">
        <Image
          className={styles.logo}
          src="/market-knowledge-logo.svg"
          alt="market knowledge logo"
          width={180}
          height={180}
          priority
        />
      </div>

      <div
        className="w-100 d-flex flex-column align-items-center"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="mb-3 w-100">
          <label htmlFor="subreddit" className="form-label">
            Subreddit to scrape
          </label>
          <input
            type="text"
            className="form-control"
            id="subreddit"
            value={subreddit}
            onChange={(e) => setSubreddit(e.target.value)}
            placeholder="e.g. cats (exclude r/ prefix)"
          />
        </div>
        <div className="mb-3 w-100">
          <label htmlFor="commentCount" className="form-label">
            Number of comments
          </label>
          <input
            type="number"
            className="form-control"
            id="commentCount"
            value={commentCount}
            onChange={(e) => setCommentCount(Number(e.target.value))}
            placeholder="e.g., 100"
            min={1}
          />
        </div>
        <div className="mb-3 w-100">
          <label htmlFor="method" className="form-label">
            Type of posts to scrape
          </label>
          <select
            className="form-select"
            id="method"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="top">Top Posts</option>
            <option value="new">New Posts</option>
            <option value="hot">Hot Posts</option>
            <option value="rising">Rising Posts</option>
            <option value="controversial">Controversial Posts</option>
          </select>
        </div>
        <button 
        type="button" 
        className="btn btn-brand w-100"
        onClick={handleScrape}>
          Scrape Comments
        </button>
      </div>
    </div>
  );
}
