import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import HomeMetricCard from '../../components/admin/HomeMetricCard';
import { Plus, Search, Filter, MoreHorizontal, Shield, Trash2, Eye } from 'lucide-react';

// You will create this modal next if you haven't already
import RegisterAdminModal from '../../components/admin/RegisterAdminModal';

const AdminManagement = () => {
    const navigate = useNavigate();
    const [admins, setAdmins] = useState([]);
    const [metrics, setMetrics] = useState({ totalAdmins: 0, superAdmins: 0, regularAdmins: 0 });
    const [loading, setLoading] = useState(true);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [adminList, metricData] = await Promise.all([
                adminService.getAllAdmins(),
                adminService.getMetrics()
            ]);
            setAdmins(adminList);
            setMetrics(metricData);
        } catch (error) {
            console.error("Failed to load admin data", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-10">

            {/* 1. Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <HomeMetricCard label="Total Admins" value={metrics.totalAdmins} borderColor="#3B82F6" />
                <HomeMetricCard label="Super Admins" value={metrics.superAdmins} borderColor="#8B5CF6" />
                <HomeMetricCard label="Regular Admins" value={metrics.regularAdmins} borderColor="#10B981" />

                {/* Quick Add Button Card */}
                <button
                    onClick={() => setIsRegisterOpen(true)}
                    className="bg-slate-900 rounded-2xl p-6 shadow-sm flex flex-col justify-center items-center gap-3 h-[120px] transition-transform hover:scale-[1.02] active:scale-95 group cursor-pointer"
                >
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-primary group-hover:text-white transition-colors">
                        <Plus size={24} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-extrabold text-white uppercase tracking-wider">Register New Admin</span>
                </button>
            </div>

            {/* 2. Main Content Card */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">

                {/* Header & Filter */}
                <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-extrabold text-slate-900">System Administrators</h2>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search admins..."
                                className="pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 w-64"
                            />
                        </div>
                        <button className="p-2.5 bg-slate-50 rounded-xl text-slate-500 hover:text-primary transition-colors">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                        <tr>
                            <th className="px-8 py-5">Admin Profile</th>
                            <th className="px-8 py-5">Role</th>
                            <th className="px-8 py-5">Email</th>
                            <th className="px-8 py-5">Status</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {admins.map((admin) => (
                            <tr key={admin.id} className="hover:bg-slate-50/80 transition-colors group">
                                <td className="px-8 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold text-sm">
                                            {admin.username?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800">{admin.username || admin.fullName}</div>
                                            <div className="text-xs font-bold text-slate-400">ID: #{admin.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide
                      ${admin.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      <Shield size={10} />
                        {admin.role?.replace('_', ' ')}
                    </span>
                                </td>
                                <td className="px-8 py-4 text-sm font-semibold text-slate-500">
                                    {admin.email}
                                </td>
                                <td className="px-8 py-4">
                     <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                      ${admin.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {admin.status || 'ACTIVE'}
                    </span>
                                </td>
                                <td className="px-8 py-4 text-right">
                                    <button
                                        onClick={() => navigate(`/admin/administrators/${admin.id}`)}
                                        className="text-sm font-bold text-slate-400 hover:text-primary transition-colors flex items-center justify-end gap-2 ml-auto"
                                    >
                                        <Eye size={16} /> View / Manage
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {loading && <div className="p-10 text-center font-bold text-slate-400">Loading data...</div>}
                </div>
            </div>

            {/* Modal for Registering New Admin */}
            {isRegisterOpen && (
                <RegisterAdminModal
                    isOpen={isRegisterOpen}
                    onClose={() => setIsRegisterOpen(false)}
                    onSuccess={loadData}
                />
            )}
        </div>
    );
};

export default AdminManagement;