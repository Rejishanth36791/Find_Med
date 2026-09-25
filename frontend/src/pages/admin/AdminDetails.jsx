import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import UpdateAdminPanel from '../../components/admin/UpdateAdminPanel';
import { ArrowLeft, Shield, Trash2, Edit3, Power, CheckCircle, Mail, Calendar } from 'lucide-react';

const AdminDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAdmin();
    }, [id]);

    const loadAdmin = async () => {
        try {
            const data = await adminService.getAdminById(id);
            setAdmin(data);
        } catch (error) {
            console.error("Error loading admin", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        if (window.confirm(`Are you sure you want to ${newStatus} this admin?`)) {
            await adminService.updateAdminStatus(id, newStatus);
            loadAdmin();
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to PERMANENTLY delete this admin?")) {
            await adminService.deleteAdmin(id);
            navigate('/admin/administrators');
        }
    };

    if (loading || !admin) return <div className="p-10 text-center font-bold text-slate-400">Loading details...</div>;

    const isActive = admin.status === 'ACTIVE';

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-10">

            {/* 1. Header Navigation */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-3 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                    <ArrowLeft size={20} className="text-slate-500" />
                </button>
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">Admin Details</h1>
                    <p className="text-slate-400 font-semibold text-sm">Manage permissions and account status</p>
                </div>
            </div>

            {/* 2. Main Profile Card */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 relative overflow-hidden">

                {/* Status Badge */}
                <div className="absolute top-10 right-10">
          <span className={`px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide flex items-center gap-2 shadow-sm
            ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
              {admin.status || 'ACTIVE'}
          </span>
                </div>

                <div className="flex flex-col md:flex-row gap-12">

                    {/* Left: Avatar & Role */}
                    <div className="flex flex-col items-center gap-4 min-w-[200px] border-r border-slate-100 pr-12">
                        <div className="w-32 h-32 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center text-4xl font-extrabold shadow-xl shadow-slate-200">
                            {admin.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-center">
                            <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">System Role</div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg text-sm font-extrabold text-slate-800">
                                <Shield size={16} className="text-primary" />
                                {admin.role}
                            </div>
                        </div>
                    </div>

                    {/* Right: Details Grid */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-4 content-center">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Full Name</label>
                            <div className="text-xl font-bold text-slate-900">{admin.fullName || admin.username}</div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">System ID</label>
                            <div className="text-xl font-mono font-bold text-slate-500">#{admin.id}</div>
                        </div>

                        <div className="col-span-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Email Address</label>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                    <Mail size={18} />
                                </div>
                                <span className="text-xl font-bold text-slate-900">{admin.email}</span>
                            </div>
                        </div>

                        <div className="col-span-2 pt-4">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Account Created</label>
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                                <Calendar size={16} />
                                {new Date(admin.createdAt || Date.now()).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Action Toolbar */}
                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap gap-4">

                    <button
                        onClick={() => setIsUpdateOpen(true)}
                        className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
                    >
                        <Edit3 size={18} /> Update Email
                    </button>

                    {isActive ? (
                        <button
                            onClick={() => handleStatusChange('DEACTIVATED')}
                            className="flex items-center gap-2 px-6 py-4 bg-amber-50 text-amber-600 font-bold rounded-xl hover:bg-amber-100 transition-colors border border-amber-100"
                        >
                            <Power size={18} /> Deactivate
                        </button>
                    ) : (
                        <button
                            onClick={() => handleStatusChange('ACTIVE')}
                            className="flex items-center gap-2 px-6 py-4 bg-emerald-50 text-emerald-600 font-bold rounded-xl hover:bg-emerald-100 transition-colors border border-emerald-100"
                        >
                            <CheckCircle size={18} /> Activate
                        </button>
                    )}

                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-6 py-4 bg-red-50 text-red-500 font-bold rounded-xl hover:bg-red-100 transition-colors ml-auto border border-red-100"
                    >
                        <Trash2 size={18} /> Remove Admin
                    </button>
                </div>
            </div>

            {/* Slide-in Update Panel */}
            <UpdateAdminPanel
                isOpen={isUpdateOpen}
                onClose={() => setIsUpdateOpen(false)}
                admin={admin}
                onSuccess={loadAdmin}
            />
        </div>
    );
};

export default AdminDetails;