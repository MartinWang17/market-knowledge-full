import { CommentListProps } from '../types';

export default function BodyCommentList({ comments, onDelete }: CommentListProps) {
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
                            <div>
                                <span className="badge bg-primary rounded-pill">{comment.upvotes} upvotes</span>
                                <span className="badge bg-secondary rounded-pill ms-2">{comment.subreddit}</span>
                                <button 
                                    className="btn btn-danger btn-sm ms-2"
                                    style={{ userSelect: "none" }}
                                    onClick={() => onDelete(comment.id)}
                                    >
                                    Delete
                                </button>
                            </div>
                        </li>
                    )
                    ))}
                </ul>
)};