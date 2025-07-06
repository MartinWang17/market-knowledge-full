import { useState } from 'react'

type AddToCollectionModalProps = {
    setAddToCollectionModal: (add: boolean) => void;
    refreshCollections: () => Promise<void>
}

export default function AddToCollectionModal({setAddToCollectionModal, refreshCollections} : AddToCollectionModalProps) {

    const [collectionName, setCollectionName] = useState("")
    const [error, setError] = useState("")
    const addCollection = async (collection_name: string) => {
        try {
            const response = await fetch("http://localhost:8000/add-collection", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    collection_name: collection_name
                })
            })
            if (response.ok) {
                const data = await response.json()
                setAddToCollectionModal(false)
                alert(data.message)
                await refreshCollections();
            } 
        } catch (error) {
            alert("Network error adding collection right here")
        }
    }
    
    return(
        <>
        <div className="modal-backdrop d-flex justify-content-center align-items-center" style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
                background: 'rgba(0, 0, 0, 0.6)',
            }}> 
            <div className="modal-content d-flex" style={{
                background: 'rgb(31, 30, 30)', padding: '1rem 2rem 2rem 2rem', borderRadius: '10px', minWidth: '300px', width: '20vw'
                }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h6 style={{ color: "#fff", margin: 0}}>Add A Collection</h6>
                        <button
                                onClick={() => setAddToCollectionModal(false)}
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
                <label>
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Choose a title"
                    value={collectionName}
                    onChange={(e) => {setCollectionName(e.target.value)}}
                    required />
                </label>
                {error && (
                    <div 
                        className="text-danger mb-2"
                        style={{ fontSize: '0.8rem', margin: 0 }}
                    >
                        {error}
                    </div>
                )}
                <div className="d-flex justify-content-center align-items-center">
                    <button 
                        className="collection-button me-2" 
                        style={{ borderRadius: "30px" }}
                        onClick={() => setAddToCollectionModal(false)}
                        >
                        Cancel
                    </button>
                    <button //button to create the collection
                        className="collection-button" 
                        style={{ borderRadius: "30px" }}
                        
                        onClick={() => {
                            if (!collectionName.trim()) {
                                setError("You must pick a title")
                                return;
                            }
                            addCollection(collectionName)
                        }}>
                        Create
                    </button>
                </div>
            </div>
        </div>
        </>
)}