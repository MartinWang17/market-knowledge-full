import { Comment } from '../types'
import { Collection } from '../types'
import { useState, useEffect } from 'react'

type collectionModalProps = {
    setShowCollectionModal: (show: boolean) => void;
    showCollectionModal: boolean;
    post: Comment;
    collections: Collection[];
}

export default function RenderCollectionModal(props: collectionModalProps) {
    const {setShowCollectionModal, showCollectionModal, post, collections} = props
    const [localCollections, setLocalCollections] = useState<string[]>(post?.collections ?? []); //Set localCollections to post.collections if it exists
    const saveToCollection = async (post: Comment, collection_name: string) => {
        try {
            const response = await fetch('http://localhost:8000/save-to-collection', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    post_id: post.id,
                    collection: collection_name
                })
            });
            if (response.ok) {
                console.log(`Saved ${post.title} to ${collection_name}`)
                alert("Collection added!")
                setLocalCollections(prev => 
                    prev.includes(collection_name)
                    ? prev.filter(name => name !== collection_name)
                    : [...prev, collection_name]
                )
            }
            else {
                alert("Error saving post to collection")
            }
        }   catch (error) {
            alert("Network error adding to collection.")
        }
    };
    
    useEffect(() => {
        post && 
        setLocalCollections(post?.collections ?? []);
    }, [post])


    return (
        <>
        {showCollectionModal && (
            <div className="modal-backdrop d-flex justify-content-center align-items-center" style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
                background: 'rgba(0, 0, 0, 0.2)',
            }}>
                <div className="modal-content" style={{
                background: 'rgb(31, 30, 30)', padding: '2rem', borderRadius: '10px', minWidth: '300px', width: '20vw'
                }}>
                    <h6 className="mb-4">Manage Collections</h6>
                        <ul style={{ listStyleType: "none", padding: 0}}>
                            {collections.map((collection) => (
                                    <li
                                        key={collection.id}
                                        className="d-flex my-2"
                                        style={{
                                            background: 'rgb(31, 30, 30)',
                                            color: '#fff', 
                                            border: 'none',
                                        }}
                                    >
                                        <label>
                                        {showCollectionModal && post &&
                                        <input
                                            type="checkbox"
                                            checked={Array.isArray(localCollections) && localCollections.includes(collection.collection_names)}
                                            onChange={() => saveToCollection(post, collection.collection_names)}
                                            className="me-2"
                                            />
                                        }                           
                                        {collection.collection_names}
                                        </label>     
                                    </li>
                            ))}
                        </ul>
                    <button className="btn btn-secondary no-hover mb-2" style={{
                        width: "100%",
                        background: "rgb(66, 66, 66)",
                        color: "#fff",
                        border: "none",
                        }} onClick={() => { /* logic for create new */ }}>
                        Create New Collection
                    </button>
                    <button className="btn btn-danger no-hover" style={{width: "100%"}} onClick={() => setShowCollectionModal(false)}>Close</button>
                </div>
            </div>
        )}
    </>
)}