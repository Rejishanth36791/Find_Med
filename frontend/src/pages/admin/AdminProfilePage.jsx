import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { User, Mail, Phone, Shield, CheckCircle, ChevronLeft } from 'lucide-react';

const AdminProfilePage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await adminService.getMyProfile();
            setProfile(data);
        } catch (e) {
            console.error("Failed to load profile", e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Loading profile...</div>;
    if (!profile) return <div className="p-10 text-center text-red-500">Failed to load profile.</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] font-sans p-4">

            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden relative">

                {/* Back Button */}
                <button
                    onClick={() => navigate('/admin')}
                    className="absolute top-6 right-6 text-sm font-medium text-teal-600 hover:text-teal-700 bg-teal-50 px-4 py-2 rounded-lg transition-colors"
                >
                    Back to Home
                </button>

                <div className="p-10 text-center">
                    <h1 className="text-3xl font-bold text-teal-700 mb-1">Admin Profile</h1>
                    <p className="text-gray-500 mb-8">View your account details below</p>

                    {/* Profile Picture */}
                    <div className="relative inline-block mb-10">
                        <div className="w-32 h-32 rounded-full border-4 border-teal-500 p-1 bg-white">
                            <div className="w-full h-full rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                                {profile.profilePictureUrl ? (
                                    <img src={profile.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={64} className="text-gray-300" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">

                        {/* Full Name */}
                        <div>
                            <label className="text-sm font-bold text-gray-700 block mb-1.5 ml-1">Full Name</label>
                            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-600">
                                <User size={18} className="text-gray-400" />
                                <span className="font-medium">{profile.fullName}</span>
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-sm font-bold text-gray-700 block mb-1.5 ml-1">Email</label>
                            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-600">
                                <Mail size={18} className="text-gray-400" />
                                <span className="font-medium">{profile.email}</span>
                            </div>
                        </div>

                        {/* Contact Number */}
                        <div>
                            <label className="text-sm font-bold text-gray-700 block mb-1.5 ml-1">Contact Number</label>
                            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-600">
                                <Phone size={18} className="text-gray-400" />
                                <span className="font-medium">{profile.contactNumber || 'Not Provided'}</span>
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <label className="text-sm font-bold text-gray-700 block mb-1.5 ml-1">Role</label>
                            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-600">
                                <Shield size={18} className="text-gray-400" />
                                <span className="font-medium">{profile.role}</span>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="md:col-span-2">
                            <label className="text-sm font-bold text-gray-700 block mb-1.5 ml-1">Status</label>
                            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-600">
                                <CheckCircle size={18} className="text-green-500" />
                                <span className="font-medium text-green-700">{profile.status}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfilePage;
