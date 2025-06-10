"use client";
import { useEffect, useState } from 'react';

type Comment = {
    id: number;
    title: string;
    body: string;
}

export default function Comments() {

    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        fetch("http://localhost:8000/comments")
            .then(res => res.json())
            .then(data => {
                // data.comments is the array of posts from Supabase
                console.log("Fetched comments:", data.comments);
                setComments(data.comments);
            })
            .catch(error => console.error("Error fetching comments:", error));
    }, [])
    
    return (
        <ul>
            {comments.map((comment) => (
                <li key={comment.id}>
                    <strong>{comment.title}</strong>: {comment.body}
                </li>
            ))}
        </ul>
    )
}