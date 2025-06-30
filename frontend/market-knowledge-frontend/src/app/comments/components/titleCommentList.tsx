import { CommentListProps } from '../types';
import RenderCollectionModal from './collectionModal';

export default function TitleCommentList( { 
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
                    ))}
                </ul>
    )
}