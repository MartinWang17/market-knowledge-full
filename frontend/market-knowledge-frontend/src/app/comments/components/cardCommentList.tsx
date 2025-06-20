import { FaExternalLinkAlt } from 'react-icons/fa';
import { CommentListProps } from '../types';

export default function CardCommentList({ comments, onDelete }: CommentListProps) {
    return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {comments.map((comment) => (
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
                            <button
                                className="btn btn-danger btn-sm ms-2"
                                onClick={() => onDelete(comment.id)}
                                >
                                Delete
                            </button>
                            </div>
                            )}
                        </div>
                    </div>
                </div>
                ))}
            </div>
)};