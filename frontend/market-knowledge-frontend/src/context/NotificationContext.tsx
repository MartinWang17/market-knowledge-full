'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type NotificationContextType = {
    showMessage: (message: string) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotification() {
    const context = useContext(NotificationContext); //gets NotificationContext.Provider value
    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [message, setMessage] = useState<string>("");

    const showMessage = (msg: string) => setMessage(msg); // Function to set the message to be displayed

    return (
        <NotificationContext.Provider value={{ showMessage }}>
            {children}
            {message && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Notification</h5>
                                <button type="button" className="btn-close" onClick={() => setMessage("")}></button>
                            </div>
                            <div className="modal-body">
                                <p>{message}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setMessage("")}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    )
}