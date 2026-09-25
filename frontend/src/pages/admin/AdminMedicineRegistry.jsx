import React, { useState, useEffect } from 'react';
import {
    Pill, CheckCircle, XCircle, AlertTriangle, Search, Filter, Plus,
    History, Eye, Trash2, Edit, ChevronLeft, ChevronRight, Activity, ArrowRight
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const AdminMedicineRegistry = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // State
    const [metrics, setMetrics] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [view, setView] = useState('dashboard'); // 'dashboard' or 'table'
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);

    // Filters & Pagination
    const [filters, setFilters] = useState({
        search: '',
        type: null,
        status: null
    });
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        totalPages: 0,
        totalElements: 0
    });

    // Initial Load
    useEffect(() => {
        fetchMetrics();
        fetchNotifications();
    }, []);

    // Fetch Medicines when filters/pagination change
    useEffect(() => {
        if (view === 'table') {
            fetchMedicines();
        }
    }, [view, filters, pagination.page, pagination.size]);

    const fetchMetrics = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/medicines/metrics'); // Port 8080 for backend
            if (res.ok) setMetrics(await res.json());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchNotifications = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/medicines/notifications');
            if (res.ok) setNotifications(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchMedicines = async () => {
        setTableLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.type) params.append('type', filters.type);
            if (filters.status) params.append('status', filters.status);
            params.append('page', pagination.page);
            params.append('size', pagination.size);

            const res = await fetch(`http://localhost:8080/api/medicines?${params}`);
            if (res.ok) {
                const data = await res.json();
                setMedicines(data.content);
                setPagination(prev => ({
                    ...prev,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements
                }));
            }
        } catch (e) { console.error(e); }
        finally { setTableLoading(false); }
    };

    const handleCardClick = (type, status) => {
        setFilters(prev => ({ ...prev, type, status, search: '' }));
        setPagination(prev => ({ ...prev, page: 0 }));
        setView('table');
    };

    const MEDICINE_TYPES = [
        { name: 'TABLET', label: 'Tablet', icon: <Pill size={24} /> },
        { name: 'CAPSULE', label: 'Capsule', icon: <div className="w-6 h-6 rounded-full border-2 border-current" /> },
        { name: 'SYRUP', label: 'Syrup', icon: <div className="w-4 h-6 bg-current opacity-50 rounded mx-auto" /> },
        { name: 'INJECTION', label: 'Injection', icon: <Activity size={24} /> },
        { name: 'CREAM_OINTMENT', label: 'Cream/Ointment', icon: <div className="w-6 h-4 bg-current rounded-full" /> },
        { name: 'DROPS', label: 'Drops', icon: <div className="w-3 h-5 rounded-full bg-current" /> },
        { name: 'INHALER', label: 'Inhaler', icon: <div className="w-5 h-5 border-2 border-current rounded" /> },
        { name: 'SUSPENSION', label: 'Suspension', icon: <div className="w-4 h-6 border-2 border-current rounded-b-lg" /> },
        { name: 'OTHER', label: 'Other', icon: <div className="w-5 h-5 bg-gray-200 rounded" /> }
    ];

    if (loading) return <div className="p-8 text-center text-gray-500">Loading registry...</div>;

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-full font-sans">
            {/* Main Content */}
            <div className="flex-1 space-y-8 min-w-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Medicine Registry</h1>
                    <p className="text-sm text-gray-500 mt-1">Centralized national medicine database</p>
                </div>

                {/* Return to Dashboard Button if in Table View */}
                {view === 'table' && (
                    <button
                        onClick={() => setView('dashboard')}
                        className="flex items-center gap-2 text-sm text-teal-600 font-medium hover:underline mb-4"
                    >
                        <ChevronLeft size={16} /> Back to Dashboard
                    </button>
                )}

                {/* Dashboard View */}
                {view === 'dashboard' && (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div
                                onClick={() => handleCardClick(null, null)}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Total Medicines</p>
                                        <h2 className="text-4xl font-bold text-gray-900 mt-2">{metrics?.total || 0}</h2>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-teal-50 transition-colors">
                                        <Pill className="text-gray-400 group-hover:text-teal-600" size={24} />
                                    </div>
                                </div>
                            </div>

                            <div
                                onClick={() => handleCardClick(null, 'ACTIVE')}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-teal-100 hover:shadow-md transition-all cursor-pointer group ring-1 ring-teal-50"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-teal-600">Active Medicines</p>
                                        <h2 className="text-4xl font-bold text-teal-700 mt-2">{metrics?.active || 0}</h2>
                                    </div>
                                    <div className="p-3 bg-teal-50 rounded-xl">
                                        <CheckCircle className="text-teal-600" size={24} />
                                    </div>
                                </div>
                            </div>

                            <div
                                onClick={() => handleCardClick(null, 'INACTIVE')}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Inactive Medicines</p>
                                        <h2 className="text-4xl font-bold text-gray-500 mt-2">{metrics?.inactive || 0}</h2>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-red-50 transition-colors">
                                        <XCircle className="text-gray-400 group-hover:text-red-500" size={24} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Type Grid */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-4">Medicine Type</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {MEDICINE_TYPES.map(type => (
                                    <div
                                        key={type.name}
                                        onClick={() => handleCardClick(type.name, null)}
                                        className="bg-white p-4 rounded-xl border border-gray-200 hover:border-teal-500 hover:shadow-sm cursor-pointer transition-all flex items-center gap-4"
                                    >
                                        <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600">
                                            {type.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{type.label}</p>
                                            <p className="text-lg font-bold text-gray-700">
                                                {metrics?.byType?.[type.name] || 0}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Table View */}
                {view === 'table' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                        {/* Table Header / Filter Bar */}
                        <div className="p-4 border-b border-gray-100 flex gap-4 items-center justify-between flex-wrap">
                            <div className="flex items-center gap-2">
                                {filters.type && (
                                    <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-medium border border-teal-100 flex items-center gap-2">
                                        Type: {MEDICINE_TYPES.find(t => t.name === filters.type)?.label}
                                        <button onClick={() => setFilters(f => ({ ...f, type: null }))} className="hover:text-teal-900"><XCircle size={14} /></button>
                                    </span>
                                )}
                                {filters.status && (
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-2 ${filters.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-700 border-gray-100'}`}>
                                        Status: {filters.status}
                                        <button onClick={() => setFilters(f => ({ ...f, status: null }))} className="hover:text-current"><XCircle size={14} /></button>
                                    </span>
                                )}
                            </div>

                            <div className="relative flex-1 max-w-md ml-auto">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search medicine name..."
                                    value={filters.search}
                                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Table Body */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Medicine Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Manufacturer</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {tableLoading ? (
                                        <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading medicines...</td></tr>
                                    ) : medicines.length === 0 ? (
                                        <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No medicines found match your criteria.</td></tr>
                                    ) : medicines.map((med) => (
                                        <tr key={med.id} className="hover:bg-gray-50/80 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{med.medicineName}</div>
                                                <div className="text-xs text-gray-500">{med.genericName}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {MEDICINE_TYPES.find(t => t.name === med.type)?.label || med.type}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${med.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {med.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{med.manufacturer}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link to={`/admin/medicines/${med.id}`} className="text-teal-600 hover:text-teal-900 flex items-center justify-end gap-1">
                                                    View / Manage <ArrowRight size={14} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        <div className="bg-gray-50 border-t border-gray-100 p-4 flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                Showing {pagination.page * pagination.size + 1} to {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of {pagination.totalElements} results
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPagination(p => ({ ...p, page: Math.max(0, p.page - 1) }))}
                                    disabled={pagination.page === 0}
                                    className="p-2 border rounded-lg hover:bg-white disabled:opacity-50"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    onClick={() => setPagination(p => ({ ...p, page: Math.min(pagination.totalPages - 1, p.page + 1) }))}
                                    disabled={pagination.page >= pagination.totalPages - 1}
                                    className="p-2 border rounded-lg hover:bg-white disabled:opacity-50"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-80 space-y-6 flex-shrink-0">
                {/* Notifications */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                        Registry Notifications
                    </h3>
                    <div className="space-y-4">
                        {notifications.length === 0 ? (
                            <p className="text-xs text-gray-400">No recent activity.</p>
                        ) : notifications.map(med => (
                            <div key={med.id} className="flex gap-3 items-start pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                                <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-gray-800 line-clamp-1">{med.medicineName}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Updated recently</p>
                                </div>
                                <Link to={`/admin/medicines/${med.id}`} className="text-xs text-teal-600 hover:underline ml-auto">View</Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <h3 className="text-sm font-bold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <Link to="/admin/medicines/add" className="w-full flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-3 rounded-lg text-sm font-medium transition-colors shadow-sm">
                            <Plus size={18} className="text-teal-600" />
                            Add New Medicine
                        </Link>
                        <button onClick={() => { setView('table'); setFilters({ search: '' }); document.querySelector('input[type="text"]')?.focus(); }} className="w-full flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-3 rounded-lg text-sm font-medium transition-colors shadow-sm">
                            <Search size={18} className="text-gray-400" />
                            Search Registry
                        </button>
                        <div onClick={() => handleCardClick(null, 'INACTIVE')} className="w-full flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-3 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer">
                            <XCircle size={18} className="text-red-400" />
                            View Inactive Medicines
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMedicineRegistry;
