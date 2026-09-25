import { useState, useEffect } from 'react';
import Layout from '../../components/pharmacy/Layout';
import api from '../../services/api';
import {
    User, Mail, Phone, MapPin, BadgeCheck,
    Clock, Calendar, FileText, Send, History,
    AlertCircle, ChevronRight, Search, Filter
} from 'lucide-react';

export default function AdminCenter() {
    const [profile, setProfile] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        type: 'Report',
        issueCategory: 'Technical',
        priority: 'High',
        title: '',
        description: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('pharmacyToken');
            const headers = { 'Authorization': `Bearer ${token}` };

            const [profileRes, historyRes] = await Promise.all([
                api.get('/pharmacy/profile'),
                api.get('/pharmacy/reports/history')
            ]);

            if (profileRes.data) setProfile(profileRes.data);
            if (historyRes.data) setHistory(historyRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            // Set empty profile instead of mock data
            setProfile({
                name: 'Loading Error',
                licenseNumber: '-',
                registrationNo: '-',
                ownerName: '-',
                nic: '-',
                contactNumber: '-',
                email: '-',
                operatingHours: '-',
                registeredDate: null,
                licenseStatus: 'Unknown',
                district: '-',
                address: '-',
                logoPath: null
            });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await api.post('/pharmacy/reports', formData);
            if (response.status === 200 || response.status === 201) {
                alert('Report submitted successfully!');
                setFormData({
                    type: 'Report',
                    issueCategory: 'Technical',
                    priority: 'High',
                    title: '',
                    description: ''
                });
                // Refresh history
                const historyRes = await api.get('/pharmacy/reports/history');
                if (historyRes.data) setHistory(historyRes.data);
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit report');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Layout title="Admin Center"><div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div></Layout>;

    return (
        <Layout title="Admin Center (Report / Inquiry)">
            <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">

                {/* Pharmacy Profile Header Card */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-10">
                    <div className="md:w-1/4 flex flex-col items-center justify-center border-r border-gray-50 pr-10">
                        <div className="w-32 h-32 rounded-3xl bg-gray-50 flex items-center justify-center text-primary mb-4 border-2 border-gray-100 overflow-hidden">
                            {profile?.logoPath ? (
                                <img src={profile.logoPath} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center">
                                    <div className="text-xs font-black uppercase opacity-20">Pharmacy Logo</div>
                                </div>
                            )}
                        </div>
                        <h2 className="text-xl font-black text-gray-800 text-center">{profile?.name}</h2>
                    </div>

                    <div className="flex-1 grid grid-cols-2 lg:grid-cols-2 gap-x-12 gap-y-4">
                        <ProfileItem label="License Number" value={profile?.licenseNumber} />
                        <ProfileItem label="Registration No" value={profile?.registrationNo} />
                        <ProfileItem label="Owner / Pharmacist" value={profile?.ownerName} />
                        <ProfileItem label="NIC" value={profile?.nic} />
                        <ProfileItem label="Contact Number" value={profile?.contactNumber} />
                        <ProfileItem label="Email" value={profile?.email} />
                        <ProfileItem label="Operating Hours" value={profile?.operatingHours} />
                        <ProfileItem label="License Status" value={profile?.licenseStatus} isStatus />
                        <ProfileItem label="Registered Date" value={profile?.registeredDate ? new Date(profile.registeredDate).toLocaleDateString() : 'N/A'} />
                        <ProfileItem label="District" value={profile?.district} />
                        <div className="col-span-2 mt-2">
                            <ProfileItem label="Address" value={profile?.address} />
                        </div>
                    </div>
                </div>

                {/* Main Action Section: Form and History */}
                <div className="space-y-8">

                    {/* Contact Admin Form */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Send className="text-primary" size={20} />
                                Contact Admin (Report / Inquiry)
                            </h3>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Type</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition bg-white"
                                    >
                                        <option value="Report">Report</option>
                                        <option value="Inquiry">Inquiry</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Issue Category</label>
                                    <select
                                        name="issueCategory"
                                        value={formData.issueCategory}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition bg-white"
                                    >
                                        <option value="Technical">Technical</option>
                                        <option value="Inventory">Inventory</option>
                                        <option value="Billing">Billing</option>
                                        <option value="Service">Service</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Priority</label>
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition bg-white"
                                    >
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    placeholder="Enter a brief title for your issue..."
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Description</label>
                                <textarea
                                    name="description"
                                    required
                                    rows="4"
                                    placeholder="Provide detailed information..."
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition resize-none"
                                ></textarea>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Attachment (Optional)</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-100 border-dashed rounded-2xl hover:border-primary/50 transition-colors group cursor-pointer">
                                    <div className="space-y-1 text-center">
                                        <AlertCircle className="mx-auto h-12 w-12 text-gray-300 group-hover:text-primary transition-colors" />
                                        <div className="flex text-sm text-gray-600">
                                            <label className="relative cursor-pointer rounded-md font-bold text-primary hover:text-primary-dark">
                                                <span>Upload a file</span>
                                                <input type="file" className="sr-only" />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-400 uppercase tracking-tighter">PNG, JPG, PDF up to 10MB</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-40 py-4 px-8 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
                            >
                                {submitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </form>
                    </div>

                    {/* Submission History Table */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <History className="text-primary" size={20} />
                                Submission History <span className="text-xs font-normal text-gray-400">(Auto-deleted after 60 days)</span>
                            </h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#2FA4A9] text-white">
                                    <tr>
                                        <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider">ID</th>
                                        <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider">Type</th>
                                        <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider">Category</th>
                                        <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider">Priority</th>
                                        <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider">Status</th>
                                        <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider">Date</th>
                                        <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {history.length === 0 ? (
                                        <tr><td colSpan="7" className="px-8 py-10 text-center text-gray-400 italic">No submissions yet.</td></tr>
                                    ) : (
                                        history.map((record) => (
                                            <tr key={record.id} className="hover:bg-gray-50/50 transition">
                                                <td className="px-8 py-6 text-sm font-bold text-gray-800">R-{record.id}</td>
                                                <td className="px-8 py-6 text-sm text-gray-600">{record.type}</td>
                                                <td className="px-8 py-6 text-sm text-gray-600">{record.category}</td>
                                                <td className="px-8 py-6">
                                                    <span className={`text-[10px] font-black ${record.priority === 'HIGH' ? 'text-red-500' : record.priority === 'MEDIUM' ? 'text-orange-500' : 'text-blue-500'}`}>
                                                        {record.priority}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${record.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                                                        record.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-sm text-gray-500">
                                                    {new Date(record.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <button className="px-4 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] font-black hover:bg-primary hover:text-white transition">
                                                        VIEW
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

function ProfileItem({ label, value, isStatus = false }) {
    return (
        <div className="flex items-start gap-4">
            <div className="min-w-[140px] flex items-baseline gap-2">
                <p className="text-sm font-bold text-gray-700 whitespace-nowrap">{label}:</p>
                {isStatus ? (
                    <span className="text-sm text-gray-500">
                        {value || 'Active'}
                    </span>
                ) : (
                    <p className="text-sm text-gray-500">{value || 'N/A'}</p>
                )}
            </div>
        </div>
    );
}
