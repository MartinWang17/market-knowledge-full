"use client";
import { useEffect, useState } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { Comment } from './types';
import CardCommentList from './components/cardCommentList';
import TitleCommentList from './components/titleCommentList';
import BodyCommentList from './components/bodyCommentList';

export default function Comments() {

    const [comments, setComments] = useState<Comment[]>([]);
    const [commentFormat, setCommentFormat] = useState("card"); // "card", "title", "body"
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8000/comments")
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
    }, [])

    // delete comment function
    const deleteComment = async (id: string) => {
        try {
            const response = await fetch('http://localhost:8000/comments/' + id, {
                method: 'DELETE',
            });
            if (response.ok) {
                // Remove the deleted comment from local state
                setComments(prev => prev.filter(comment => comment.id !== id));
            } 
            else {
                const data = await response.json();
                alert("Error deleting comment: " + (data.error || response.status));
            }
        }   catch (error) {
            alert("Network error deleting comment.")
        }
    };

    if (loading) {
        return (
            <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (comments.length === 0) {
        return (
            <div className="text-center">No comments...yet. <br/>Start a scrape and start knowing your market!</div>
        );
    }

    const renderFormatSelector = (
        <div className="mb-3 w-50">
                    <label htmlFor="commentFormat" className="form-label">
                        Select Comment Format
                    </label>
                    <select
                        className="form-select"
                        id="commentFormat"
                        value={commentFormat}
                        onChange={(e) => setCommentFormat(e.target.value)}
                    >
                        <option value="card">Card View</option>
                        <option value="title">Title Only</option>
                        <option value="body">Body Only</option>
                    </select>
            </div>
    );

    return (
        <div className="container py-4">
            {renderFormatSelector}
            {commentFormat === "card" && <CardCommentList comments={comments} onDelete={deleteComment}/>}
            {commentFormat === "title" && <TitleCommentList comments={comments} onDelete={deleteComment}/>}
            {commentFormat === "body" && <BodyCommentList comments={comments} onDelete={deleteComment}/>}
        </div>
    )};