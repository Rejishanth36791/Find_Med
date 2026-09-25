import React, { useState, useEffect } from 'react';
import {
    Bell, CheckCircle, Clock, AlertTriangle, Search, Filter,
    Eye, ChevronLeft, ChevronRight, Activity, Calendar
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AdminNotificationCenter = () => {
    const navigate = useNavigate();

    // State
    const [notifications, setNotifications] = useState([]);
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('ALL');
    const [filterRead, setFilterRead] = useState('ALL'); // 'ALL', 'READ', 'UNREAD'
    const [search, setSearch] = useState('');

    // Mock Role - In production this comes from Auth Context
    const USER_ROLE = 'ADMIN';

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            // Fetch Metrics
            const metricsRes = await fetch(`http://localhost:8081/api/notifications/metrics?role=${USER_ROLE}`);
            if (metricsRes.ok) setMetrics(await metricsRes.json());

            // Fetch Notifications
            const notifRes = await fetch(`http://localhost:8081/api/notifications?role=${USER_ROLE}`);
            if (notifRes.ok) setNotifications(await notifRes.json());
        } catch (e) {
            console.error("Failed to fetch notifications", e);
        } finally {
            setLoading(false);
        }
    };

    // Derived Data
    const filteredNotifications = notifications.filter(n => {
        const matchesType = filterType === 'ALL' || n.notificationType === filterType;
        const matchesRead = filterRead === 'ALL' ||
            (filterRead === 'READ' && n.read) ||
            (filterRead === 'UNREAD' && !n.read);
        const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
            n.message.toLowerCase().includes(search.toLowerCase());
        return matchesType && matchesRead && matchesSearch;
    });

    const getIcon = (type) => {
        switch (type) {
            case 'PHARMACY': return <span className="bg-blue-100 text-blue-600 p-2 rounded-lg"><Activity size={18} /></span>;
            case 'ADMIN': return <span className="bg-purple-100 text-purple-600 p-2 rounded-lg"><Bell size={18} /></span>;
            case 'CIVILIAN': return <span className="bg-orange-100 text-orange-600 p-2 rounded-lg"><Clock size={18} /></span>;
            case 'SYSTEM': return <span className="bg-red-100 text-red-600 p-2 rounded-lg"><AlertTriangle size={18} /></span>;
            default: return <span className="bg-gray-100 text-gray-600 p-2 rounded-lg"><Bell size={18} /></span>;
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Loading Notification Center...</div>;

    return (
        <div className="flex flex-col gap-6 h-full font-sans max-w-7xl mx-auto w-full">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Notification Center</h1>
                <p className="text-sm text-gray-500 mt-1">Manage system alerts, updates, and activities.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Pharmacy Notifications', count: metrics?.pharmacy || 0, type: 'PHARMACY', color: 'text-blue-600 border-blue-100 bg-blue-50/50' },
                    { label: 'Admin Notifications', count: metrics?.admin || 0, type: 'ADMIN', color: 'text-purple-600 border-purple-100 bg-purple-50/50' },
                    { label: 'Civilian Notifications', count: metrics?.civilian || 0, type: 'CIVILIAN', color: 'text-orange-600 border-orange-100 bg-orange-50/50' },
                    { label: 'System Notifications', count: metrics?.system || 0, type: 'SYSTEM', color: 'text-red-600 border-red-100 bg-red-50/50' },
                ].map(card => (
                    <div
                        key={card.label}
                        onClick={() => setFilterType(curr => curr === card.type ? 'ALL' : card.type)}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all hover:shadow-md ${filterType === card.type ? 'ring-2 ring-teal-500 border-transparent shadow-sm' : 'border-gray-100 bg-white'}`}
                    >
                        <p className="text-sm font-medium text-gray-500">{card.label}</p>
                        <h2 className={`text-3xl font-bold mt-2 ${card.color.split(' ')[0]}`}>{card.count}</h2>
                    </div>
                ))}
            </div>

            {/* Read/Unread Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                    onClick={() => setFilterRead(curr => curr === 'UNREAD' ? 'ALL' : 'UNREAD')}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all bg-white flex justify-between items-center group ${filterRead === 'UNREAD' ? 'ring-2 ring-red-500 border-transparent' : 'border-gray-100 hover:border-red-200'}`}
                >
                    <div>
                        <p className="text-sm font-medium text-red-500 group-hover:text-red-600">Unread Notifications</p>
                        <h2 className="text-4xl font-bold text-gray-900 mt-1">{metrics?.unread || 0}</h2>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                        <Bell size={24} />
                    </div>
                </div>

                <div
                    onClick={() => setFilterRead(curr => curr === 'READ' ? 'ALL' : 'READ')}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all bg-white flex justify-between items-center group ${filterRead === 'READ' ? 'ring-2 ring-emerald-500 border-transparent' : 'border-gray-100 hover:border-emerald-200'}`}
                >
                    <div>
                        <p className="text-sm font-medium text-emerald-600 group-hover:text-emerald-700">Read Notifications</p>
                        <h2 className="text-4xl font-bold text-gray-900 mt-1">{metrics?.read || 0}</h2>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <CheckCircle size={24} />
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-[400px]">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        {filterType !== 'ALL' && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium flex items-center gap-2">
                                Type: {filterType}
                                <button onClick={() => setFilterType('ALL')} className="hover:text-black">&times;</button>
                            </span>
                        )}
                        {filterRead !== 'ALL' && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium flex items-center gap-2">
                                Status: {filterRead}
                                <button onClick={() => setFilterRead('ALL')} className="hover:text-black">&times;</button>
                            </span>
                        )}
                    </div>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search notifications..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date & Time</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredNotifications.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                        No notifications found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredNotifications.map(notif => (
                                    <tr key={notif.id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">#{notif.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{notif.title}</div>
                                            <div className="text-xs text-gray-500 line-clamp-1">{notif.message}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-700 border border-gray-100">
                                                {notif.notificationType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {notif.read ? (
                                                <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">Read</span>
                                            ) : (
                                                <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 animate-pulse">Unread</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                            {new Date(notif.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => navigate(`/admin/notifications/${notif.id}`)}
                                                className="text-teal-600 hover:text-teal-800 text-xs font-medium px-3 py-1.5 rounded bg-teal-50 hover:bg-teal-100 transition-colors"
                                            >
                                                View Details
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
    );
};

export default AdminNotificationCenter;
