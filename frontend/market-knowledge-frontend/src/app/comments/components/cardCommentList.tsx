'use client'
import { FaExternalLinkAlt } from 'react-icons/fa';
import { CommentListProps } from '../types';

console.log("Rendering CardCommentList")
export default function CardCommentList({
    comments, 
    onDelete, 
    setShowCollectionModal,
    setActivePost 
    }: CommentListProps) {

    return ( 
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {comments.map((comment) => (
                <div className="col" key={comment.id}>
                    <div className="card h-100 shadow" style={{ background: "#1E555C", color: "#ededed" }}>
                        <div className="card-body d-flex flex-column">
                            <a 
                            href={comment.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="card-title fw-bold text-info mb-2 text-decoration-none"
                            >
                                <FaExternalLinkAlt style={{ verticalAlign: "middle", marginRight: 8 }} />
                                {comment.title}
                            </a>
                            <div className="card-text mb-4" style={{ color: "fff" }}>
                                {comment.body.length > 500 ? (
                                <>
                                {comment.body.slice(0, 500)} ...
                                <br />
                                <br />
                                ...click link to read more
                                </>
                                ) : (comment.body)}
                            </div>
                            {comment.upvotes && (
                            <div className="mt-auto small text-light opacity-75">
                                ⬆️{comment.upvotes} upvotes
                                <span style={{ float: "right" }}>{comment.subreddit}</span>
                                <button 
                                className="btn btn-danger btn-sm ms-2 noselect"
                                onClick={() => onDelete(comment.id)}
                                >
                                    Delete
                                </button>
                                <button
                                className="btn secondary-btn-color btn-sm ms-2 noselect"
                                onClick={() => {
                                    setShowCollectionModal(true)
                                    setActivePost(comment)}}>
                                Save
                                </button>
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
)};