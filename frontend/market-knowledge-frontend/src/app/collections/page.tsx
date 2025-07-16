"use client";
import Link from 'next/link';
import GetCollections from '../getCollections'
import { useUser } from '@/context/UserContext';
import { useState, useEffect } from 'react';
import LoadingSpinner from '../loadingSpinner';

export default function Collections() {

    const { collections, setCollections, refreshCollections } = GetCollections();
    const [loading, setLoading] = useState(true);
    const user = useUser();

    useEffect(() => {
        if (!user) {
            setCollections([]);
            setLoading(false);
        } else {
            setLoading(true);
            refreshCollections()
                .catch(error => {
                console.error("Error refreshing collections:", error);
                })
                .finally(() => setLoading(false));
        }
    }, [user, setCollections]);
    const deleteCollection = async (collection_name: string) => {
        try {
            const response = await fetch("http://localhost:8000/delete-collection", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    collection_name: collection_name
                })
            });
            if (response.ok) {
                setCollections(prev => prev.filter(collection => collection.collection_names !== collection_name))
            }
        }   catch(error) {
            alert("Network error deleting collection")
        }
    }

 if (!user) {
    return <div className="text-center">Please log in to view your collections.</div>;
 }

 if (loading) {
    return <LoadingSpinner />;
 }

 if (collections.length === 0) {
    return <div className="text-center">No collections found. Start adding some!</div>;
 }

 return ( 
    <div className="container my-5">
        <ul className="d-flex list-group text-center">
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
                <Link href={`/collections/${collection.slug}`}>{collection.collection_names}</Link>
                <button
                    className="btn btn-danger"
                    style={{ float: "right" }}
                    onClick={() => {
                        const confirmed = window.confirm("Are you sure you want to delete this collection?");
                        if (confirmed) {
                        deleteCollection(collection.collection_names)
                        }
                    }}
                >
                    Delete
                </button>
                </li>
            ))}
        </ul>
    </div>
 )};