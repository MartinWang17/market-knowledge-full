import { Comment } from '../types'
import { Collection } from '../types'

type collectionModalProps = {
    setShowCollectionModal: (show: boolean) => void;
    showCollectionModal: boolean;
    post: Comment;
    collections: Collection[];
}

export default function RenderCollectionModal(props: collectionModalProps) {
    const {setShowCollectionModal, showCollectionModal, post, collections} = props

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
                        <ul className="list-group">
                            {collections.map((collection) => (
                                    <li
                                        key={collection.id}
                                        className="d-flex justify-content-start my-2"
                                        style={{
                                            background: 'rgb(31, 30, 30)',
                                            color: '#fff', 
                                            border: 'none',
                                        }}
                                    >
                                        <label>
                                        <input
                                            type="checkbox"
                                            key={collection.id}
                                            checked={Array.isArray(post.collections) && post.collections.includes(collection.collection_names)}
                                            onChange={() => console.log(collection.collection_names, post.collections, post)}
                                            className="me-2"
                                            />
                                        {collection.collection_names}
                                        </label>     
                                    </li>
                            ))}
                        </ul>
                    <button className="btn btn-secondary mb-2" style={{
                        width: "100%",
                        background: "rgb(66, 66, 66)",
                        color: "#fff",
                        border: "none",
                        }} onClick={() => { /* logic for create new */ }}>Create New Collection</button>
                    <button className="btn btn-danger" style={{width: "100%"}} onClick={() => setShowCollectionModal(false)}>Close</button>
                </div>
            </div>
        )}
    </>
)}