"use client";
import { useEffect, useState } from 'react';
import { Comment } from './types';
import { CardCommentList, TitleCommentList, BodyCommentList } from './components';
import RenderFormatSelector from '../formatSelector';
import LoadingSpinner from '../loadingSpinner'
import GetCollections from '../getCollections'

console.log("Running in parent page of comments")
export default function Comments() {

    const [comments, setComments] = useState<Comment[]>([]);
    const [commentFormat, setCommentFormat] = useState("card"); // "card", "title", "body"
    const [commentFilter, setCommentFilter] = useState("relevance"); //
    const [loading, setLoading] = useState(true);
    const { collections } = GetCollections();

    useEffect(() => {
        fetch(`http://localhost:8000/comments?filter=${commentFilter}`)
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
    }, [commentFilter]) //Refresh comments when filter changes

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
        return <LoadingSpinner />
    }

    if (comments.length === 0) {
        return (
            <div className="text-center">No comments...yet. <br/>Start a scrape and start knowing your market!</div>
        );
    }

    return (
        <div className="container py-4">
            <RenderFormatSelector 
                commentFormat={commentFormat}
                setCommentFormat={setCommentFormat}
                commentFilter={commentFilter}
                setCommentFilter={setCommentFilter}
                />
            {commentFormat === "card" && <CardCommentList comments={comments} onDelete={deleteComment} collections={collections}/>}
            {commentFormat === "title" && <TitleCommentList comments={comments} onDelete={deleteComment} collections={collections}/>}
            {commentFormat === "body" && <BodyCommentList comments={comments} onDelete={deleteComment} collections={collections}/>}
        </div>
    )};