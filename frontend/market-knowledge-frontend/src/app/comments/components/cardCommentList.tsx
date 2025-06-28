'use client'
import { FaExternalLinkAlt } from 'react-icons/fa';
import { CommentListProps } from '../types';
import { useState } from 'react';

    
export default function CardCommentList({ comments, onDelete }: CommentListProps) {
    const [showCollectionModal, setShowCollectionModal] = useState(false);
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
                                className="btn btn-danger btn-sm ms-2 noselect"
                                onClick={() => onDelete(comment.id)}
                                >
                                Delete
                            </button>
                            <button
                                className="btn secondary-btn-color btn-sm ms-2 noselect"
                                onClick={() => setShowCollectionModal(true)}
                                >
                            Save
                            </button>
                            {showCollectionModal && (
                                <div className="modal-backdrop" style={{
                                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
                                    background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <div className="modal-content" style={{
                                    background: '#fff', padding: '2rem', borderRadius: '10px', minWidth: '300px', width: '50vw'
                                    }}>
                                    <h5>Manage Collections</h5>
                                    <button className="btn btn-success mb-2" style={{width: "100%"}} onClick={() => { /* logic for create new */ }}>Create New Collection</button>
                                    <button className="btn btn-secondary mb-2" style={{width: "100%"}} onClick={() => { /* logic for add to collection */ }}>Add to Collection</button>
                                    <button className="btn btn-danger" style={{width: "100%"}} onClick={() => setShowCollectionModal(false)}>Close</button>
                                    </div>
                                </div>
                                )}
                            </div>
                            )}
                        </div>
                    </div>
                </div>
                ))}
            </div>
)};