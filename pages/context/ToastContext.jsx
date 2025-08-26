import React, { createContext, useState, useContext, useEffect } from 'react';
import ToastComponent from '../components/ToastComponent';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [isClient, setIsClient] = useState(false);

    // Set isClient to true once component mounts (client-side only)
    useEffect(() => {
        setIsClient(true);
    }, []);

    const showToast = (message, type = 'success', duration = 3000) => {
        // Only show toasts on the client side
        if (!isClient) return '';

        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);
        return id;
    };

    const removeToast = (id) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast, removeToast }}>
            {children}
            {isClient && (
                <div className="toast-container">
                    {toasts.map((toast) => (
                        <ToastComponent
                            key={toast.id}
                            message={toast.message}
                            type={toast.type}
                            duration={toast.duration}
                            onClose={() => removeToast(toast.id)}
                        />
                    ))}
                </div>
            )}
        </ToastContext.Provider>
    );
};