type collectionModalProps = {
    setShowCollectionModal: (show: boolean) => void;
    showCollectionModal: boolean;
    setSaveToCollectionModal: (show: boolean) => void;
    saveToCollectionModal: boolean;
}

export default function RenderCollectionModal(props: collectionModalProps) {
    const {setShowCollectionModal, showCollectionModal, saveToCollectionModal, setSaveToCollectionModal} = props
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
                background: 'rgb(31, 30, 30)', padding: '2rem', borderRadius: '10px', minWidth: '300px', width: '50vw'
                }}>
                    <h5>Manage Collections</h5>
                    <button className="btn mb-2" style={{width: "100%", color: "#fff"}} onClick={() => { /* logic for create new */ }}>Create New Collection</button>
                    <button className="btn btn-secondary mb-2" style={{width: "100%"}} onClick={() => {}}>Add to Collection</button>
                    <button className="btn btn-danger" style={{width: "100%"}} onClick={() => setShowCollectionModal(false)}>Close</button>
                </div>
            </div>
        )}
        {saveToCollectionModal && (
            <div className="modal-backdrop d-flex justify-content-center align-items-center" style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                background: 'rgba(0, 0, 0, 0.2)'
            }}>
                <div className="modal-content" style={{
                    background: '#000', padding: '2rem', borderRadius: '10px', minWidth: '30px', width: '50vw'
                }}>
                    <h5>Testing for save to collection</h5>
                    <button className="btn btn-danger" style={{width: "100%"}} onClick={() => setSaveToCollectionModal(false)}>Close</button>
                </div>
            </div>
        )}
    </>
)}