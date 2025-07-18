import { Comment } from '../types'
import { Collection } from '../types'
import { useState, useEffect } from 'react'
import AddToCollectionModal from './AddToCollectionModal'

type collectionModalProps = {
    setShowCollectionModal: (show: boolean) => void;
    showCollectionModal: boolean;
    post: Comment | null;
    collections: Collection[];
    refreshCollections: () => Promise<void>
}

export default function RenderCollectionModal(props: collectionModalProps) {
    const {setShowCollectionModal, showCollectionModal, post, collections, refreshCollections} = props
    //use localCollections to auto update collections
    const [localCollections, setLocalCollections] = useState<string[]>(post?.collections ?? []); //Set localCollections to post.collections if it exists
    const [addToCollectionModal, setAddToCollectionModal] = useState(false)

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
                setLocalCollections(prev => [...prev, collection_name])
            }
            else {
                alert("Error saving post to collection")
            }
        }   catch (error) {
            alert("Network error adding to collection.")
        }
    };
    const removeFromCollection = async (post: Comment, collection_name: string) => {
        try{
            const response = await fetch("http://localhost:8000/remove-from-collection", {
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
                console.log(`Removed ${post.title} from ${collection_name}`)
                //Goes through the collection array and saves all collections that is not the collection_name being removed
                setLocalCollections(prev => prev.filter(name => name !== collection_name))
            }
            else {
                alert(`Error removing ${post.title} from ${collection_name}`)
            }
        }   catch (error) {
                alert("Nerwork error removing from collection")
        }
    }
    
    useEffect(() => {
        post && 
        setLocalCollections(post?.collections ?? []);
    }, [post])

    if (!post) return null //When modal first renders and post does not exist yet

    return (
        <>
        {addToCollectionModal &&
            <AddToCollectionModal 
                setAddToCollectionModal={setAddToCollectionModal}
                refreshCollections={refreshCollections}
        />}
        {showCollectionModal && (
            <div className="modal-backdrop d-flex justify-content-center align-items-center" style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
                background: 'rgba(0, 0, 0, 0.2)',
            }}>
                <div className="modal-content" style={{
                background: 'rgb(31, 30, 30)', padding: '1rem 2rem 2rem 2rem', borderRadius: '10px', minWidth: '300px', width: '20vw'
                }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h6 style={{ color: "#fff", margin: 0 }}>Manage Collections</h6>
                        <button
                                onClick={() => setShowCollectionModal(false)}
                                style={{ 
                                    background: 'none',
                                    border: 'none',
                                    color: 'white',
                                    padding: 0,
                                }}
                                className="fs-2"
                                aria-label="Close modal"
                                >
                                    &times;
                            </button>
                    </div>
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
                                            onChange={(e) => {
                                                console.log(e.target.checked)
                                                if (e.target.checked) {
                                                    //collection.collection_names is the CURRENT collection name. It's the collection column in table collections
                                                    saveToCollection(post, collection.collection_names)
                                                }
                                                else {
                                                    removeFromCollection(post, collection.collection_names)
                                                }
                                                
                                            }}
                                            className="me-2"
                                            />
                                        }                           
                                        {collection.collection_names}
                                        </label>     
                                    </li>
                            ))}
                        </ul>
                    <button 
                        className="collection-button mb-2"
                        style={{ borderRadius: "30px" }}
                        onClick={() => {
                            setAddToCollectionModal(true);
                            setShowCollectionModal(false);
                            }}>
                        Create New Collection
                    </button>
                    {/* <button className="custom-close-button" style={{width: "100%"}} onClick={() => setShowCollectionModal(false)}>Close</button> */}
                </div>
            </div>
        )}
    </>
)}