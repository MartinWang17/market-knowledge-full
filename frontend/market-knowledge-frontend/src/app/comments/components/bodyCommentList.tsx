import { CommentListProps } from '../types';
import RenderCollectionModal from './collectionModal';

export default function BodyCommentList({
    comments, 
    onDelete, 
    collections,
    showCollectionModal,
    setShowCollectionModal,
    activePost,
    setActivePost,
    }: CommentListProps) {

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
                                <button
                                    className="btn secondary-btn-color btn-sm ms-2 noselect"
                                    onClick={() => {
                                        setShowCollectionModal(true)
                                        setActivePost(comment)}}>
                                    Save
                                </button>
                                {showCollectionModal && activePost && (
                                    <RenderCollectionModal 
                                        showCollectionModal={showCollectionModal}
                                        setShowCollectionModal={setShowCollectionModal}
                                        post={activePost}
                                        collections={collections}
                                    />
                                )}
                            </div>
                        </li>
                    )
                    ))}
                </ul>
)};