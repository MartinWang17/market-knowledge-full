"use client";
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Collection } from '../comments/types';
import Link from 'next/link';

export default function Collections() {

    const [collections, setCollections] = useState<Collection[]>([]);
    const [commentFormat, setCommentFormat] = useState("card"); // "card", "title", "body"
    const [commentFilter, setCommentFilter] = useState("relevance"); // "all", "upvoted", "downvoted", etc.
        useEffect(() => {
        fetch(`http://localhost:8000/collections`)
            .then(res => res.json())
            .then(data => {
                // data.comments is the array of posts from Supabase
                console.log("Fetched collections:", data.collections);
                setCollections(data.collections);
            })
            .catch(error => {
                console.error("Error fetching comments:", error);
            });
    }, []) //Refresh comments when filter changes

 return ( 
    <div className="container my-5">
        <ul className="list-group text-center">
            {collections.map((collection) => (
                <li
                    key={collection.id}
                    className="list-group-item text-center mb-2 fs-3"
                    style={{ 
                                backgroundColor: "#1E555C",
                                color: "#fff",
                                border: "none",
                            }}
                >
                <Link href={`/collections/${collection.collection_names}`}>{collection.collection_names}</Link>
                </li>
            ))}
        </ul>
    </div>
 )};