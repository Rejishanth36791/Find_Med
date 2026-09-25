import React from 'react';
import { AlertCircle, X } from 'lucide-react';

function CancelReservationModal({ onConfirm, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                {/* Header */}
                <div className="bg-teal-50 px-6 py-4 flex justify-between items-center border-b border-teal-100">
                    <h3 className="text-lg font-bold text-teal-800">Confirm Cancellation</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="bg-red-100 p-2 rounded-full">
                            <AlertCircle className="text-red-600 w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-gray-700 font-medium text-lg">Are you sure?</p>
                            <p className="text-gray-500 mt-1">
                                Do you want to confirm the cancellation of this reservation? This action cannot be undone.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                    >
                        No, Go Back
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 shadow-md hover:shadow-lg transition-all"
                    >
                        Yes, Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CancelReservationModal;
