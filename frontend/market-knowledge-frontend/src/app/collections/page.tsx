"use client";
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Comment } from '../comments/types';
import Link from 'next/link';

export default function Collections() {

    const [collections, setCollections] = useState([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentFormat, setCommentFormat] = useState("card"); // "card", "title", "body"
    const [commentFilter, setCommentFilter] = useState("relevance"); // "all", "upvoted", "downvoted", etc.
        useEffect(() => {
        fetch(`http://localhost:8000/comments?filter=${commentFilter}`)
            .then(res => res.json())
            .then(data => {
                // data.comments is the array of posts from Supabase
                console.log("Fetched comments:", data.comments);
                setComments(data.comments);
            })
            .catch(error => {
                console.error("Error fetching comments:", error);
            });
    }, []) //Refresh comments when filter changes

 return ( 
    <div className="container my-5">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            <Link href="/collections/Favorites">Favorites</Link>
        </div>
    </div>
 )};