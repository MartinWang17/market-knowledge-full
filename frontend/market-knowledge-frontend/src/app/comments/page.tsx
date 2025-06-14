"use client";
import { useEffect, useState } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';

type Comment = {
    id: number;
    title: string;
    body: string;
    link: string;
    upvotes: number;
    subreddit: string;
}

export default function Comments() {

    const [comments, setComments] = useState<Comment[]>([]);
    const [commentFormat, setCommentFormat] = useState("card"); // "card", "title", "body"

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

    if (comments.length === 0) {
        return (
            <div className="text-center">No comments...yet. <br/>Start a scrape and start knowing your market!</div>
        );
    }
    else if (commentFormat === "card") {
        return (
        <div className="container py-4">
            <div className="mb-3 w-50">
                    <label htmlFor="commentFormat" className="form-label">
                        Select Comment Format
                    </label>
                    <select
                        className="form-select"
                        id="commentFormat"
                        value={commentFormat}
                        onChange={(e) => setCommentFormat(e.target.value)}
                    >
                        <option value="card">Card View</option>
                        <option value="title">Title Only</option>
                        <option value="body">Body Only</option>
                    </select>
                </div>
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
                            <div className="card-text mb-4" style={{ color: "#fff" }}>
                            {comment.body}
                            </div>
                            {comment.upvotes && (
                            <div className="mt-auto small text-light opacity-75">
                                ⬆️ {comment.upvotes} upvotes 
                                <span style={{ float: "right" }}>{comment.subreddit}</span>
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
    else if (commentFormat === "title") {
        return (
            <div className="container py-4">
                <div className="mb-3 w-50">
                    <label htmlFor="commentFormat" className="form-label">
                        Select Comment Format
                    </label>
                    <select
                        className="form-select"
                        id="commentFormat"
                        value={commentFormat}
                        onChange={(e) => setCommentFormat(e.target.value)}
                    >
                        <option value="card">Card View</option>
                        <option value="title">Title Only</option>
                        <option value="body">Body Only</option>
                    </select>
                </div>
                <ul className="list-group">
                    {comments.map((comment) => (
                        <li 
                            key={comment.id} 
                            className="list-group-item d-flex justify-content-between align-items-center"
                            style={{ 
                                backgroundColor: "#1E555C",
                                color: "fff",
                                border: "none",
                            }}
                            >
                            <a href={comment.link} target="_blank" rel="noopener noreferrer" className="text-decoration-none"
                                style={{ color: "#fff"}}>
                                {comment.title}
                            </a>
                            <span className="badge bg-primary rounded-pill">{comment.upvotes} upvotes</span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
    else if (commentFormat === "body") {
        return (
            <div className="container py-4">
                <div className="mb-3 w-50">
                    <label htmlFor="commentFormat" className="form-label">
                        Select Comment Format
                    </label>
                    <select
                        className="form-select"
                        id="commentFormat"
                        value={commentFormat}
                        onChange={(e) => setCommentFormat(e.target.value)}
                    >
                        <option value="card">Card View</option>
                        <option value="title">Title Only</option>
                        <option value="body">Body Only</option>
                    </select>
                </div>
                <ul className="list-group">
                    {comments.map((comment) => (
                        comment.body && comment.body.trim() !== "" && (
                        <li 
                        key={comment.id} 
                        className="list-group-item"
                        style={{ backgroundColor: "#1E555C", color: "#fff", border: "none" }}>
                            {comment.body}
                            <span className="badge bg-primary rounded-pill">{comment.upvotes} upvotes</span>
                        </li>
                    )
                    ))}
                </ul>
            </div>
        );
    }
}

// Ternary operator
//     return (
//         comments.length === 0 ? (
//             <div className="text-center">No comments...yet. <br/>Start a scrape and start knowing your market!</div>
//         ) : (
//         <div className="container py-4">
//             <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
//                 {comments.map((comment) => (
//                 <div className="col" key={comment.id}>
//                     <div className="card h-100 shadow" style={{ background: "rgba(30,85,92,0.7)", color: "#ededed" }}>
//                         <div className="card-body d-flex flex-column">
//                             <a // External link to open the Reddit post in a new tab
//                             href={comment.link} 
//                             target="_blank" 
//                             rel="noopener noreferrer"
//                             className="card-title fw-bold text-info mb-2 text-decoration-none"
//                             style={{ fontSize: "1.1rem" }}
//                             >
//                             <FaExternalLinkAlt style={{ verticalAlign: "middle", marginRight: 8}} />
//                             {comment.title}
//                             </a>
//                             <div className="card-text mb-4" style={{ color: "#fff" }}>
//                             {comment.body}
//                             </div>
//                             {comment.upvotes && (
//                             <div className="mt-auto small text-light opacity-75">
//                                 ⬆️ {comment.upvotes} upvotes 
//                                 <span style={{ float: "right" }}>{comment.subreddit}</span>
//                             </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//                 ))}
//             </div>
//         </div>
//     ));
// }