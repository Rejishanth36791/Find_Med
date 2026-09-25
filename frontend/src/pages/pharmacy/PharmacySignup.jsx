import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, Mail, User, MapPin, Phone, FileText, ArrowRight } from 'lucide-react';

const PharmacySignup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        ownerName: '',
        email: '',
        password: '',
        licenseNumber: '',
        phone: '',
        address: '',
        district: ''
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
            const response = await fetch('http://localhost:8080/api/pharmacy/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Assuming successful signup redirects to login
                navigate('/login');
            } else {
                const errorData = await response.text();
                setError('Registration failed: ' + (errorData || 'Please check your details'));
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-blue-50 p-4 py-12">
            <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 transform transition-all hover:scale-[1.01]">

                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 mb-4 shadow-inner">
                        <Activity size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Pharmacy Registration</h2>
                    <p className="text-gray-500 mt-2">Join the network and simplify healthcare access</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-gray-700 font-medium text-sm ml-1">Pharmacy Name</label>
                            <div className="relative">
                                <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                                    placeholder="City Care Pharmacy"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-gray-700 font-medium text-sm ml-1">Owner Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="ownerName"
                                    required
                                    value={formData.ownerName}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                                    placeholder="Mr. John Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-gray-700 font-medium text-sm ml-1">License Number</label>
                            <div className="relative">
                                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="licenseNumber"
                                    required
                                    value={formData.licenseNumber}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                                    placeholder="LIC-12345"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-gray-700 font-medium text-sm ml-1">District</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="district"
                                    required
                                    value={formData.district}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                                    placeholder="Kandy"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
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
                                    placeholder="contact@pharmacy.com"
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

                        <div className="space-y-2">
                            <label className="text-gray-700 font-medium text-sm ml-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                                    placeholder="+94 77 123 4567"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-gray-700 font-medium text-sm ml-1">Full Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="address"
                                    required
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                                    placeholder="123 Main St, City"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-1 md:col-span-2 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : 'Complete Registration'}
                            {!loading && <ArrowRight size={20} />}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500">
                        Already have an account?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-teal-600 font-bold hover:text-teal-700 hover:underline transition-colors"
                        >
                            Sign In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PharmacySignup;
