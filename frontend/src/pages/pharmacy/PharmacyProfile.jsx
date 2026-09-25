import { useState, useEffect, useRef } from 'react';
import Layout from '../../components/pharmacy/Layout';
import api from '../../services/api';
import {
    Save, Building, MapPin, Phone, Mail, Clock, FileText, CheckCircle, AlertCircle, Upload
} from 'lucide-react';

export default function PharmacyProfile() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef(null);

    const [profile, setProfile] = useState({
        name: '',
        licenseNumber: '',
        registrationNo: '',
        ownerName: '',
        nic: '',
        contactNumber: '',
        email: '',
        operatingHours: '',
        registeredDate: '',
        licenseStatus: '',
        district: '',
        address: '',
        logoPath: '',
        licenseDocument: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/pharmacy/profile');
            if (res.data) {
                setProfile(res.data);
            } else {
                console.error('Failed to fetch profile: No data');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('pharmacyToken');
            const res = await fetch('http://localhost:8080/api/pharmacy/profile/upload-logo', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setProfile(prev => ({ ...prev, logoPath: data.logoUrl }));
                // alert('Logo uploaded successfully!');
            } else {
                alert('Failed to upload logo.');
            }
        } catch (error) {
            console.error('Error uploading logo:', error);
            alert('Error uploading logo.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await api.put('/pharmacy/profile', profile);
            if (res.status === 200 || res.status === 204) {
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(error.response?.data?.message || 'An error occurred while updating profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Layout title="Pharmacy Profile">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </Layout>
        );
    }

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `http://localhost:8080${path}`;
    };

    return (
        <Layout title="Pharmacy Profile">
            <div className="max-w-6xl mx-auto pb-12 animate-in fade-in duration-500">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleLogoUpload}
                    />

                    {/* Header / Identity Section */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-10 items-center">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-3xl bg-gray-50 flex items-center justify-center text-primary border-4 border-gray-100 overflow-hidden shadow-inner">
                                {profile.logoPath ? (
                                    <img src={getImageUrl(profile.logoPath)} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <Building size={48} className="opacity-20" />
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="absolute bottom-2 right-2 bg-white text-primary p-2 rounded-xl shadow-lg border border-gray-100 hover:bg-primary hover:text-white transition group-hover:scale-110"
                            >
                                <Upload size={16} />
                            </button>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div>
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Pharmacy Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleInputChange}
                                    className="w-full text-3xl font-black text-gray-800 bg-transparent border-b-2 border-transparent hover:border-gray-200 focus:border-primary focus:outline-none transition px-2 -mx-2"
                                    placeholder="Enter Pharmacy Name"
                                />
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <div className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                    <CheckCircle size={14} />
                                    {profile.licenseStatus || 'Status Unknown'}
                                </div>
                                <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                    <Building size={14} />
                                    Reg: {profile.registrationNo || 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Contact & Location Info */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 space-y-6">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 pb-4 border-b border-gray-50">
                                <MapPin className="text-primary" size={20} />
                                Location & Contact
                            </h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Address</label>
                                    <textarea
                                        name="address"
                                        value={profile.address}
                                        onChange={handleInputChange}
                                        rows="2"
                                        className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">District</label>
                                        <input
                                            type="text"
                                            name="district"
                                            value={profile.district}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Contact Number</label>
                                        <input
                                            type="text"
                                            name="contactNumber"
                                            value={profile.contactNumber}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profile.email}
                                        readOnly
                                        className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                                    />
                                    <p className="text-[10px] text-gray-400 px-2">*Email cannot be changed directly.</p>
                                </div>
                            </div>
                        </div>

                        {/* Legal & Owner Info */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 space-y-6">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 pb-4 border-b border-gray-50">
                                <FileText className="text-primary" size={20} />
                                Legal & Operation
                            </h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Owner Name</label>
                                    <input
                                        type="text"
                                        name="ownerName"
                                        value={profile.ownerName}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">NIC</label>
                                        <input
                                            type="text"
                                            name="nic"
                                            value={profile.nic}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">License No</label>
                                        <input
                                            type="text" // Assuming License Num is editable or read-only? Usually read-only but let's make it read-only for safety
                                            name="licenseNumber"
                                            value={profile.licenseNumber}
                                            readOnly
                                            className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Operating Hours</label>
                                    <input
                                        type="text"
                                        name="operatingHours"
                                        value={profile.operatingHours}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Mon-Fri: 8am-8pm, Sat: 9am-5pm"
                                        className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition"
                                    />
                                </div>


                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            className="px-8 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition"
                            onClick={() => fetchProfile()} // Reset form
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-10 py-4 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex items-center gap-2"
                        >
                            <Save size={18} />
                            {saving ? 'Saving Changes...' : 'Save Changes'}
                        </button>
                    </div>

                </form>
            </div>
        </Layout>
    );
}
