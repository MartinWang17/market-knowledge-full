import { CommentListProps } from '../types';
import { useState } from 'react'
import RenderCollectionModal from './collectionModal'

export default function TitleCommentList( { comments, onDelete }: CommentListProps) {
    const [showCollectionModal, setShowCollectionModal] = useState(false);
    return (
        <ul className="list-group">
                    {comments.map((comment) => (
                        <li 
                            key={comment.id} 
                            className="list-group-item d-flex justify-content-between align-items-center"
                            style={{ 
                                backgroundColor: "#1E555C",
                                color: "#fff",
                                border: "none",
                            }}
                            >
                            <a href={comment.link} target="_blank" rel="noopener noreferrer" className="text-decoration-none"
                                style={{ color: "#fff"}}>
                                {comment.title}
                            </a>
                            {/* <span className="badge bg-primary rounded-pill">
                                {comment.upvotes} upvotes
                                <span className="badge bg-secondary rounded-pill5 ms-2">
                                    {comment.subreddit}
                                </span>
                            </span> */}
                            <div className="d-flex align-items-center">
                                <span className="badge bg-primary rounded-pill">{comment.upvotes} upvotes</span>
                                <span className="badge bg-secondary rounded-pill">{comment.subreddit}</span>
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
                    ))}
                </ul>
    )
}