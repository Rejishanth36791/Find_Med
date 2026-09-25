import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { X, Mail, Shield, User } from 'lucide-react';

const UpdateAdminPanel = ({ isOpen, onClose, admin, onSuccess }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (admin) setEmail(admin.email);
    }, [admin]);

    if (!isOpen || !admin) return null;

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await adminService.updateAdminEmail(admin.id, { email });
            onSuccess();
            onClose();
        } catch (error) {
            alert("Failed to update email: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* 1. Dark Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* 2. Sliding Panel */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-0 flex flex-col animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h2 className="text-lg font-extrabold text-slate-900">Update Admin Details</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleUpdate} className="flex-1 p-8 space-y-8 overflow-y-auto">

                    {/* Read Only Fields */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <User size={14} /> Full Name (Read Only)
                            </label>
                            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-500">
                                {admin.fullName || admin.username}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <Shield size={14} /> Role (Read Only)
                            </label>
                            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-500">
                                {admin.role}
                            </div>
                        </div>
                    </div>

                    {/* Editable Field */}
                    <div className="pt-6 border-t border-slate-100 space-y-4">
                        <label className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                            <Mail size={16} /> New Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                            placeholder="Enter new email..."
                        />
                        <p className="text-xs text-slate-400 font-medium leading-relaxed">
                            Updating this email will change the login credentials for this admin.
                            The system will log this action for security purposes.
                        </p>
                    </div>
                </form>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3.5 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="flex-1 py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200 disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateAdminPanel;