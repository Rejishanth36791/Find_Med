import React, { createContext, useContext, useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto-dismiss
        setTimeout(() => {
            removeToast(id);
        }, 3000);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`min-w-[300px] p-4 rounded-lg shadow-lg flex items-center justify-between text-white animate-fade-in-up ${toast.type === 'success' ? 'bg-green-600' :
                                toast.type === 'error' ? 'bg-red-600' :
                                    toast.type === 'warning' ? 'bg-yellow-600' :
                                        'bg-gray-800'
                            }`}
                    >
                        <span className="text-sm font-medium">{toast.message}</span>
                        <button onClick={() => removeToast(toast.id)} className="ml-4 hover:opacity-75">
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);
