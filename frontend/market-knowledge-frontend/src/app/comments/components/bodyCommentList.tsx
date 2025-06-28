import { CommentListProps } from '../types';
import { useState } from 'react';
import RenderCollectionModal from './collectionModal';

export default function BodyCommentList({ comments, onDelete }: CommentListProps) {
    const [showCollectionModal, setShowCollectionModal] = useState(false);
    return (
        <ul className="list-group">
                    {comments.map((comment) => (
                        // Check if the body is not empty or just whitespace. If not, render the row.
                        comment.body && comment.body.trim() !== "" && (
                        <li 
                        key={comment.id} 
                        className="list-group-item"
                        style={{ backgroundColor: "#1E555C", color: "#fff", border: "none" }}>
                            {comment.body}
                            {/* <span className="badge bg-primary rounded-pill">{comment.upvotes} upvotes</span> */}
                            <div className="d-flex align-items-center">
                                <span className="badge bg-primary rounded-pill">{comment.upvotes} upvotes</span>
                                <span className="badge bg-secondary rounded-pill ms-2">{comment.subreddit}</span>
                                <button 
                                    className="btn btn-danger btn-sm ms-2 noselect"
                                    onClick={() => onDelete(comment.id)}
                                    >
                                    Delete
                                </button>
                                <RenderCollectionModal 
                                    showCollectionModal={showCollectionModal}
                                    setShowCollectionModal={setShowCollectionModal}
                                    />
                            </div>
                        </li>
                    )
                    ))}
                </ul>
)};