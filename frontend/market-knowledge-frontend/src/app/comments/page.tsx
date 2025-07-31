"use client";
import { useEffect, useState } from 'react';
import { Comment } from './types';
import RenderFormatSelector from '../formatSelector';
import LoadingSpinner from '../loadingSpinner'
import GetCollections from '../getCollections'
import CommentsManager from './components/CommentsManager'
import RenderCollectionModal from './components/collectionModal'
import { useUser } from "@/context/UserContext";

console.log("Running in parent page of comments")
export default function Comments() {

    const [comments, setComments] = useState<Comment[]>([]);
    const [commentFormat, setCommentFormat] = useState("card"); // "card", "title", "body"
    const [commentFilter, setCommentFilter] = useState("relevance"); //
    const [showCollectionModal, setShowCollectionModal] = useState(false);
    const [activePost, setActivePost] = useState<Comment | null>(null);
    const [loading, setLoading] = useState(true);
    const { collections, refreshCollections } = GetCollections();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const user = useUser();

    useEffect(() => {
        if (!user) {
            setComments([]);
            setLoading(false);
            return;
        } else {
            setLoading(true);
            fetch(`${API_URL}/comments?filter=${commentFilter}`)
                .then(res => res.json())
                .then(data => {
                    // data.comments is the array of posts from Supabase
                    // // Check if user is logged in
                    // if (!user) {
                    //     setLoading(false);
                    //     return;
                    // }
                    // Filter comments by user ID if user is logged in
                    const userComments = data.comments.filter((comment: Comment) => comment.user_id === user.id)
                    setComments(userComments);
                })
                .catch(error => {
                    console.error("Error fetching comments:", error);
                })
                .finally(() => {
                    setLoading(false);
                })
            }
    }, [commentFilter, user]); //Refresh comments when filter changes

    // delete comment function
    const deleteComment = async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/comments/` + id, {
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
                console.error(error);
                alert("Network error deleting comment.");
        }
    };

    if (!user) {
            return <div className="text-center">Please log in to view comments.</div>;
        }

    if (loading) {
        return <LoadingSpinner />;
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
            <CommentsManager 
                comments={comments}
                onDelete={deleteComment}
                collections={collections} 
                commentFormat={commentFormat}
                showCollectionModal={showCollectionModal}
                setShowCollectionModal={setShowCollectionModal}
                activePost={activePost}
                setActivePost={setActivePost}
                />
            <RenderCollectionModal 
                showCollectionModal={showCollectionModal}
                setShowCollectionModal={setShowCollectionModal}
                post={activePost}
                collections={collections}
                refreshCollections={refreshCollections}
            />
        </div>
    )};