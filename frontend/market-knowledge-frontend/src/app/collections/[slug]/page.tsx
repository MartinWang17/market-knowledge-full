"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Comment } from '../../comments/types';
import RenderFormatSelector from '../../formatSelector';
import LoadingSpinner from '../../loadingSpinner'
import GetCollections from '../../getCollections'
import CommentsManager from '../../comments/components/CommentsManager'
import RenderCollectionModal from '../../comments/components/collectionModal'
import { useUser } from '@/context/UserContext'

export default function CollectionSlugPage() {

    const [comments, setComments] = useState<Comment[]>([]);
    const [commentFormat, setCommentFormat] = useState("card"); // "card", "title", "body"
    const [commentFilter, setCommentFilter] = useState("relevance"); // "all", "upvoted", "downvoted", etc.
    const [showCollectionModal, setShowCollectionModal] = useState(false);
    const [activePost, setActivePost] = useState<Comment | null>(null);
    const [loading, setLoading] = useState(true);
    const { collections, refreshCollections } = GetCollections();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const user = useUser()

    useEffect(() => {
        if (!user) {
            setComments([]);
            setLoading(false);
            return;
        } else {
            fetch(`${API_URL}/comments?user_id=${user.id}&filter=${commentFilter}`)
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
        };
    }, [commentFilter, showCollectionModal]) //Refresh comments when filter changes

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
        alert("Network error deleting comment:");
    }
    };

    const params = useParams();
    if (!params || !params.slug){
        return <div>Invalid collection slug</div>
    }
    const slug = params.slug as string;

    //update comment to only include comments in the current collection. Checks if the comment has a collection and if it includes the current collection name
    const collectionComments = comments.filter((comment) => 
        comment.user_id === user?.id &&
        comment.collections && 
        comment.collections.some((name) => encodeURIComponent(name) === slug) // Handle URL encoded names
    ); 

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <div className="container my-5">
            <div className="text-center mb-4">
                <span className="badge secondary-badge-color fs-3">Collection: {decodeURIComponent(slug)}</span>
            </div>
            <RenderFormatSelector
                commentFormat={commentFormat}
                setCommentFormat={setCommentFormat}
                commentFilter={commentFilter}
                setCommentFilter={setCommentFilter}
            />
            <CommentsManager 
                comments={collectionComments}
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
    );
}