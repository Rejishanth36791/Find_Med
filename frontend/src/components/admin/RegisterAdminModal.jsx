
import React, { useState } from 'react';
import { adminService } from '../../services/adminService';
import { X, UserPlus, Mail, Lock, User, Shield } from 'lucide-react';

const RegisterAdminModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        role: 'ADMIN' // Default role
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await adminService.createAdmin(formData);
            onSuccess(); // Refresh parent list
            onClose();   // Close modal
            // Reset form
            setFormData({
                email: '',
                password: '',
                fullName: '',
                role: 'ADMIN'
            });
        } catch (err) {
            console.error("Failed to register admin", err);
            console.log("Error Response Data:", err.response?.data); // Log for debugging

            let errorMessage = "Failed to register new administrator.";
            if (err.response?.data) {
                if (typeof err.response.data === 'string') {
                    errorMessage = err.response.data;
                } else if (err.response.data.message) {
                    errorMessage = err.response.data.message;
                } else if (typeof err.response.data === 'object') {
                    // Handle validation errors map
                    const messages = Object.values(err.response.data).join(', ');
                    if (messages) errorMessage = messages;
                }
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <UserPlus size={20} />
                        </div>
                        New Administrator
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-5">

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">


                        {/* Full Name */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">System Role</label>
                            <div className="relative">
                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <select
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="ADMIN">Administrator</option>
                                    <option value="SUPER_ADMIN">Super Administrator</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3.5 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterAdminModal;
