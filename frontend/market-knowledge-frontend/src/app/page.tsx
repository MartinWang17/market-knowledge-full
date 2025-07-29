"use client";
import { useState } from 'react';
// import Image from "next/image";
// import styles from "./page.module.css";
import { useUser } from '@/context/UserContext';
import { useNotification } from "@/context/NotificationContext";

export default function Home() {

  const [subreddit, setSubreddit] = useState("");
  const [commentCount, setCommentCount] = useState(10);
  const [method, setMethod] = useState("top");
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [timeFilter, setTimeFilter] = useState("all");
  const [scraping, setScraping] = useState(false)
  const user = useUser();
  const { showMessage } = useNotification();

  if (user) {
    console.log("User ID:", user.id);
  } else {
    console.log("User not loaded yet or not logged in")
  }

  const handleScrape = async () => {
    if (!user) {
      alert("You must be logged in to scrape comments.");
      return;
    }
    console.log("Scraping comments from subreddit:", subreddit);
    console.log("Number of comments to scrape:", commentCount);
    console.log("Scrape method:", method);
    console.log("Keyword to search:", keyword);
    console.log("User ID in handleScrape:", user.id)

    if (subreddit.includes("r/")) {
      alert("Please enter the subreddit name without the 'r/' prefix.");
      return;
    }

    setScraping(true);

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
          keyword: keyword,
          sort: sortBy,
          time_filter: timeFilter,
          user_id: user.id
        }),
      });
      if (!response.ok) {
        throw new Error("Server Error:" + response.status)
      }

      //parse the JSON response
      const data = await response.json()
      const { message } = data;
      // Show notification message
      if (message) {
        setScraping(false);
        showMessage(message);
      }

      console.log("Scrape response:", data);
    } catch (error) {
      console.error("Error scraping comments:", error);
    }
    // Reset the input fields after scraping
    setScraping(false);
    setSubreddit("");
    setCommentCount(10);
  }

  const [keywordSearch, setKeywordSearch] = useState(false);
  // Method to toggle keyword search
  const handleKeywordSearch = () => {
    setKeywordSearch(!keywordSearch);
  }

  if (keywordSearch) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center"
        style={{ width: "100vw" }}>
          {/* <div className="mb-1 d-flex">
            <Image
              className={styles.logo}
              src="/market-knowledge-logo-dark.png"
              alt="market knowledge logo"
              width={180}
              height={180}
              priority
            />
          </div> */}
          <h1 className="main-heading text-center mt-5 mb-4">
            Start scraping and <br />
            <span className="highlighted ms-2">
              know your market
            </span>
          </h1>
        <button
          type="button"
          className="btn btn-outline-secondary mb-3"
          onClick={handleKeywordSearch}
          >
          <span className="me-2">🔙</span> Default Search
        </button>
        
        <div className="mb-3 w-100"
          style={{ maxWidth: "400px", width: "100%" }}
          >
          <label htmlFor="subreddit" className="form-label">
            Subreddit to search
          </label>
          <input
            type="text"
            className="form-control mb-3"
            id="subreddit"
            value={subreddit}
            onChange={(e) => setSubreddit(e.target.value)}
            placeholder="e.g. Anxiety (exclude r/ prefix)"
          />
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
            <label htmlFor="keyword" className="form-label">
              Keyword to search
            </label>
            <input
              type="text"
              className="form-control"
              id="keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g., Night"
            />
          </div>
          <div className="mb-3 w-100">
            <label htmlFor="sortBy" className="form-label">
              Sort by
            </label>
            <select
              className="form-select"
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="relevance">Relevance</option>
              <option value="hot">Hot</option>
              <option value="new">New</option>
              <option value="top">Top</option>
              <option value="comments">Most Comments</option>
            </select>
          </div>
          <div className="mb-3 w-100">
            <label htmlFor="timeFilter" className="form-label">
              Time Filter
            </label>
            <select
              className="form-select"
              id="timeFilter"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="hour">Past Hour</option>
              <option value="day">Past Day</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="year">Past Year</option>
            </select>
          </div>
          <button 
          type="button" 
          className="btn btn-brand w-100"
          onClick={handleScrape}>
            Scrape Comments
          </button>
        </div>
        {scraping && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1050 }}
          >
            <div className="bg-dark text-white p-4 rounded">
              <h5>⏳ Scraping comments...</h5>
            </div>
          </div>
        )}
      </div>
    );
  }

  else {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center"
          style={{ width: "100vw"}}>
        {/* <div className="mb-1 d-flex justify-content-center">
          <Image
            className={styles.logo}
            src="/market-knowledge-logo-dark.png"
            alt="market knowledge logo"
            width={180}
            height={180}
            priority
          />
        </div> */}
        <h1 className="main-heading text-center mt-5 mb-4">
          Start scraping and <br />
          <span className="highlighted ms-2">
            know your market
          </span>
        </h1>
        <button
          type="button"
          className="btn btn-outline-secondary mb-3"
          onClick={handleKeywordSearch}
          >
          <span className="me-2">🔍</span> Search by Keyword
        </button>
        <form className="w-100 d-flex flex-column align-items-center"
          style={{ maxWidth: "400px", width: "100%" }}
          onSubmit={(e) => {
            e.preventDefault();
            handleScrape();
          }}>
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
              required
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
          type="submit" 
          className="btn btn-brand w-100">
            Scrape Comments
          </button>
        </form>
        {scraping && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1050 }}
          >
            <div className="bg-dark text-white p-4 rounded">
              <h5>⏳ Scraping comments...</h5>
            </div>
          </div>
        )}
      </div>
    );
}}
