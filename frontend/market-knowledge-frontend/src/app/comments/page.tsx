"use client";
import { useEffect, useState } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';

type Comment = {
    id: number;
    title: string;
    body: string;
    link: string;
    upvotes: number;
}

export default function Comments() {

    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        fetch("http://localhost:8000/comments")
            .then(res => res.json())
            .then(data => {
                // data.comments is the array of posts from Supabase
                console.log("Fetched comments:", data.comments);
                setComments(data.comments);
            })
            .catch(error => console.error("Error fetching comments:", error));
    }, [])
    
    return (
        <div className="container py-4">
  <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
    {comments.map((comment) => (
      <div className="col" key={comment.id}>
        <div className="card h-100 shadow" style={{ background: "rgba(30,85,92,0.7)", color: "#ededed" }}>
          <div className="card-body d-flex flex-column">
            <a // External link to open the Reddit post in a new tab
              href={comment.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="card-title fw-bold text-info mb-2 text-decoration-none"
              style={{ fontSize: "1.1rem" }}
            >
            <FaExternalLinkAlt style={{ verticalAlign: "middle", marginRight: 8}} />
              {comment.title}
            </a>
            <div className="card-text mb-4" style={{ color: "#b0d3db" }}>
              {comment.body}
            </div>
            {comment.upvotes && (
              <div className="mt-auto small text-light opacity-75">
                ⬆️ {comment.upvotes} upvotes
              </div>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
    );
}