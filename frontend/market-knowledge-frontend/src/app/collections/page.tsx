"use client";
import Link from 'next/link';
import GetCollections from '../getCollections'

export default function Collections() {

    const { collections, setCollections } = GetCollections();
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