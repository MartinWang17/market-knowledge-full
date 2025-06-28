type collectionModalProps = {
    setShowCollectionModal: (show: boolean) => void;
    showCollectionModal: boolean;
}

export default function RenderCollectionModal(props: collectionModalProps) {
    const {setShowCollectionModal, showCollectionModal} = props
    return (
        <>
        <button
            className="btn secondary-btn-color btn-sm ms-2 noselect"
            onClick={() => setShowCollectionModal(true)}>
        Save
        </button>
        {showCollectionModal && (
            <div className="modal-backdrop" style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
                background: 'rgba(0, 0, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <div className="modal-content" style={{
                background: '#fff', padding: '2rem', borderRadius: '10px', minWidth: '300px', width: '50vw'
                }}>
                <h5>Manage Collections</h5>
                <button className="btn btn-success mb-2" style={{width: "100%"}} onClick={() => { /* logic for create new */ }}>Create New Collection</button>
                <button className="btn btn-secondary mb-2" style={{width: "100%"}} onClick={() => { /* logic for add to collection */ }}>Add to Collection</button>
                <button className="btn btn-danger" style={{width: "100%"}} onClick={() => setShowCollectionModal(false)}>Close</button>
                </div>
            </div>
        )}
    </>
)}