import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center"
         style={{ width: "100vw"}}>
      <div className="mb-4 d-flex justify-content-center">
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
            placeholder="e.g., 100"
            min={1}
          />
        </div>
        <button type="button" className="btn btn-brand w-100">
          Scrape Comments
        </button>
      </div>
    </div>
  );
}
