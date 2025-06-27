"use client";
import { useParams } from 'next/navigation';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Comment } from '../../comments/types';
import RenderFormatSelector from '../../formatSelector';
import LoadingSpinner from '../../loadingSpinner'

export default function CollectionSlugPage() {

    const [comments, setComments] = useState<Comment[]>([]);
    const [commentFormat, setCommentFormat] = useState("card"); // "card", "title", "body"
    const [commentFilter, setCommentFilter] = useState("relevance"); // "all", "upvoted", "downvoted", etc.
    const [loading, setLoading] = useState(true);

        useEffect(() => {
        fetch(`http://localhost:8000/comments?filter=${commentFilter}`)
            .then(res => res.json())
            .then(data => {
                // data.comments is the array of posts from Supabase
                console.log("Fetched comments:", data.comments);
                setComments(data.comments);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching comments:", error);
                setLoading(false);
            });
    }, [commentFilter]) //Refresh comments when filter changes

    const params = useParams();
    const slug = params.slug as string;

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <div className="container my-5">
            <div className="text-center mb-4">
                <span className="badge secondary-badge-color fs-3">Collection: {slug}</span>
            </div>
            <RenderFormatSelector
                commentFormat={commentFormat}
                setCommentFormat={setCommentFormat}
                commentFilter={commentFilter}
                setCommentFilter={setCommentFilter}
            />
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {comments
                    .filter((comment) => comment.collections && comment.collections.includes(slug))
                    .map((comment) => (
                <div className="col" key={comment.id}>
                    <div className="card h-100 shadow" style={{ background: "#1E555C", color: "#ededed" }}>
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