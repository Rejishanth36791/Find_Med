import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, Mail } from 'lucide-react';
import { authService } from '../../services/authService';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await authService.loginAdmin(email, password);
            navigate('/admin/dashboard');
        } catch (err) {
            console.error("Admin Login Failed", err);
            setError('Access Denied. Invalid credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-4 font-['Inter']">
            <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-[#2FA4A9]/10 rounded-2xl flex items-center justify-center mb-4 text-[#2FA4A9]">
                        <ShieldAlert size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Restricted Area</h1>
                    <p className="text-gray-500 text-sm mt-2">Authorized Personnel Only</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3 text-sm font-medium">
                        <ShieldAlert size={18} className="flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Administrator ID</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#2FA4A9] transition-colors" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#2FA4A9] focus:ring-2 focus:ring-[#2FA4A9]/20 transition-all font-medium"
                                placeholder="admin@system.local"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Secure Key</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#2FA4A9] transition-colors" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#2FA4A9] focus:ring-2 focus:ring-[#2FA4A9]/20 transition-all font-medium"
                                placeholder="••••••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-[#2FA4A9] hover:bg-[#258d91] text-white font-bold py-4 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg shadow-[#2FA4A9]/20 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Authenticating...</span>
                            </div>
                        ) : 'Establish Session'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-400">
                        Unauthorized access is strictly prohibited.
                        <br />
                        System IP: 192.168.X.X
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
