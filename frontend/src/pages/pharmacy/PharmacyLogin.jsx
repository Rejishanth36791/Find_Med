import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, Mail, ArrowRight } from 'lucide-react';

const PharmacyLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            console.log('Attempting login to:', 'http://localhost:8080/api/pharmacy/auth/login');
            const response = await fetch('http://localhost:8080/api/pharmacy/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data.id);
                localStorage.setItem('pharmacyToken', data.token);
                localStorage.setItem('pharmacyId', data.id);
                localStorage.setItem('role', 'PHARMACY');
                navigate('/pharmacy');
            } else {
                let errorMessage = 'Invalid credentials';
                try {
                    const errorText = await response.text();
                    errorMessage = errorText || errorMessage;
                } catch (e) {
                    console.error('Failed to parse error response:', e);
                }
                setError('Login failed: ' + errorMessage);
            }
        } catch (err) {
            console.error('Login request failed:', err);
            setError('Connection error: Please check if the backend is running on port 8080.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-blue-50 p-4">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 transform transition-all hover:scale-[1.01]">

                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 mb-4 shadow-inner">
                        <Activity size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Welcome Back</h2>
                    <p className="text-gray-500 mt-2">Access your pharmacy dashboard</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-gray-700 font-medium text-sm ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                                placeholder="name@pharmacy.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-gray-700 font-medium text-sm ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                        {!loading && <ArrowRight size={20} />}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500">
                        Don't have an account?{' '}
                        <button
                            onClick={() => navigate('/pharmacy-signup')}
                            className="text-teal-600 font-bold hover:text-teal-700 hover:underline transition-colors"
                        >
                            Register Pharmacy
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PharmacyLogin;
