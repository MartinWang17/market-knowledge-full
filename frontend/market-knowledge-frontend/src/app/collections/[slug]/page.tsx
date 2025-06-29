"use client";
import { useParams } from 'next/navigation';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Comment } from '../../comments/types';
import RenderFormatSelector from '../../formatSelector';
import LoadingSpinner from '../../loadingSpinner'
import { CardCommentList, TitleCommentList, BodyCommentList } from '../../comments/components'
import GetCollections from '../../getCollections'

export default function CollectionSlugPage() {

    const [comments, setComments] = useState<Comment[]>([]);
    const [commentFormat, setCommentFormat] = useState("card"); // "card", "title", "body"
    const [commentFilter, setCommentFilter] = useState("relevance"); // "all", "upvoted", "downvoted", etc.
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

    const params = useParams();
    const slug = params.slug as string;

    //update comment to only include comments in the current collection
    const collectionComments = comments.filter((comment) => comment.collections && comment.collections.includes(slug));

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <div className="container my-5">
            <div className="text-center mb-4">
                <span className="badge secondary-badge-color fs-3">Collection: {slug}</span>
            </div>
            <RenderFormatSelector
                commentFormat={commentFormat}
                setCommentFormat={setCommentFormat}
                commentFilter={commentFilter}
                setCommentFilter={setCommentFilter}
            />
        {commentFormat === "card" && <CardCommentList comments={collectionComments} onDelete={deleteComment} collections={collections}/>}
        {commentFormat === "body" && <BodyCommentList comments={collectionComments} onDelete={deleteComment} collections={collections}/>}
        {commentFormat === "title" && <TitleCommentList comments={collectionComments} onDelete={deleteComment} collections={collections}/>}
    </div>
    );
}