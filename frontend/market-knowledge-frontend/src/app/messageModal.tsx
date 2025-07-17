import { useState } from 'react';

export default function MessageModal({ message, setMessage } : { message: string, setMessage: (msg: string) => void }) {
    const [show, setShow] = useState(true);

    const handleClose = () => {
        setShow(false);
        setMessage("");
    };

    if (!show || !message) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Notification</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <p>{message}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}