import { Comment } from '../types';

export default function BodyCommentList({ comments }: { comments: Comment[] }) {
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
                            </div>
                        </li>
                    )
                    ))}
                </ul>
)};