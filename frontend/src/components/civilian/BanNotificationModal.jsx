import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const BanNotificationModal = ({ isOpen, onClose, banReason, banDate }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleAppeal = () => {
        onClose();
        navigate('/civilian/appeals-reports');
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="bg-orange-50 p-6 flex items-center gap-4 border-b border-orange-100">
                    <div className="p-3 bg-orange-100 rounded-full">
                        <ShieldAlert className="w-8 h-8 text-orange-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Account Temporarily Banned</h3>
                        <p className="text-sm text-orange-600 font-medium">Action Required</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Ban Reason</p>
                        <p className="text-gray-800 font-medium">{banReason || "No reason provided."}</p>
                    </div>

                    {banDate && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="font-medium">Ban Date:</span>
                            <span>{new Date(banDate).toLocaleDateString()}</span>
                        </div>
                    )}

                    <p className="text-sm text-gray-600 leading-relaxed">
                        Your account has been temporarily suspended. You can appeal this decision if you believe it was a mistake.
                    </p>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleAppeal}
                        className="px-4 py-2 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm hover:shadow-md transition-all"
                    >
                        Appeal Decision
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BanNotificationModal;
