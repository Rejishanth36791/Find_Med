import React, { useState, useMemo } from 'react';
import Layout from '../../components/pharmacy/Layout';
import { useNotifications } from '../../context/NotificationContext';
import {
    AlertCircle,
    AlertTriangle,
    Info,
    ShoppingBag,
    Package,
    Calendar,
    Settings,
    Filter,
    CheckCircle2,
    ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotificationCenter() {
    const { notifications, markAsRead } = useNotifications();
    const [activeFilter, setActiveFilter] = useState('All');
    const [viewHistory, setViewHistory] = useState(false);
    const navigate = useNavigate();

    const categories = [
        { id: 'All', name: 'All', icon: <Filter size={20} /> },
        { id: 'Reservations', name: 'Reservations', icon: <ShoppingBag size={20} /> },
        { id: 'Inventory', name: 'Inventory', icon: <Package size={20} /> },
        { id: 'Expiry & Stock', name: 'Expiry & Stock', icon: <Calendar size={20} /> },
        { id: 'Admin & System', name: 'Admin & System', icon: <Settings size={20} /> },
    ];

    const filteredNotifications = useMemo(() => {
        return notifications
            .filter(n => {
                const matchesCategory = activeFilter === 'All' || n.category === activeFilter;
                const matchesStatus = viewHistory ? n.status === 'Read' : n.status === 'Unread';
                return matchesCategory && matchesStatus;
            })
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }, [notifications, activeFilter, viewHistory]);

    const stats = useMemo(() => {
        return {
            unread: notifications.filter(n => n.status === 'Unread').length,
            reservations: notifications.filter(n => n.category === 'Reservations' && n.status === 'Unread').length,
            inventory: notifications.filter(n => n.category === 'Inventory' && n.status === 'Unread').length,
            expiry: notifications.filter(n => n.category === 'Expiry & Stock' && n.status === 'Unread').length,
            admin: notifications.filter(n => n.category === 'Admin & System' && n.status === 'Unread').length,
        };
    }, [notifications]);

    const getPriorityStyles = (priority) => {
        switch (priority) {
            case 'Critical': return 'text-red-600 bg-red-50 border-red-100';
            case 'Warning': return 'text-orange-600 bg-orange-50 border-orange-100';
            case 'Info': return 'text-blue-600 bg-blue-50 border-blue-100';
            default: return 'text-gray-600 bg-gray-50 border-gray-100';
        }
    };

    const getIcon = (category, priority) => {
        if (priority === 'Critical') return <AlertCircle className="text-red-500" />;
        if (priority === 'Warning') return <AlertTriangle className="text-orange-500" />;

        switch (category) {
            case 'Reservations': return <ShoppingBag className="text-blue-500" />;
            case 'Inventory': return <Package className="text-orange-500" />;
            case 'Expiry & Stock': return <Calendar className="text-red-500" />;
            case 'Admin & System': return <Settings className="text-purple-500" />;
            default: return <Info className="text-blue-500" />;
        }
    };

    return (
        <Layout title="Notification & Alert Center">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Notification Center</h1>
                        <p className="text-lg text-gray-500 mt-2">Manage and respond to system alerts and activities.</p>
                    </div>
                    <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 p-1">
                        <button
                            onClick={() => setViewHistory(false)}
                            className={`px-6 py-2 rounded-lg font-bold transition-all ${!viewHistory ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Active Alerts ({stats.unread})
                        </button>
                        <button
                            onClick={() => setViewHistory(true)}
                            className={`px-6 py-2 rounded-lg font-bold transition-all ${viewHistory ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            History
                        </button>
                    </div>
                </div>

                {/* Category Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.slice(1).map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveFilter(cat.id)}
                            className={`bg-white p-6 rounded-2xl border-2 transition-all text-left shadow-sm hover:shadow-md ${activeFilter === cat.id ? 'border-primary ring-4 ring-primary/5' : 'border-gray-100'}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className={`p-3 rounded-xl ${cat.id === 'Reservations' ? 'bg-blue-50 text-blue-600' :
                                    cat.id === 'Inventory' ? 'bg-orange-50 text-orange-600' :
                                        cat.id === 'Expiry & Stock' ? 'bg-red-50 text-red-600' :
                                            'bg-purple-50 text-purple-600'
                                    }`}>
                                    {cat.icon}
                                </span>
                                <span className="text-3xl font-black text-gray-900">
                                    {cat.id === 'Reservations' ? stats.reservations :
                                        cat.id === 'Inventory' ? stats.inventory :
                                            cat.id === 'Expiry & Stock' ? stats.expiry :
                                                stats.admin}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">{cat.name}</h3>
                            <p className="text-gray-500 text-sm mt-1">Unread Notifications</p>
                        </button>
                    ))}
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider mr-2">Filter By:</span>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveFilter(cat.id)}
                            className={`px-5 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${activeFilter === cat.id
                                ? 'bg-gray-900 text-white shadow-lg scale-105'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
                                }`}
                        >
                            {cat.icon}
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Notifications List */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {viewHistory ? 'Notification History' : `${activeFilter} Notifications`}
                        </h2>
                        {activeFilter !== 'All' && (
                            <button
                                onClick={() => setActiveFilter('All')}
                                className="text-primary font-bold hover:underline text-sm"
                            >
                                Clear Category Filter
                            </button>
                        )}
                    </div>

                    <div className="divide-y divide-gray-50">
                        {filteredNotifications.length === 0 ? (
                            <div className="p-20 text-center space-y-4">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 size={40} className="text-gray-300" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">All caught up!</h3>
                                    <p className="text-gray-500 mt-1">No {activeFilter.toLowerCase()} notifications {viewHistory ? 'in history' : 'to show'}.</p>
                                </div>
                            </div>
                        ) : (
                            filteredNotifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`p-8 hover:bg-gray-50 transition-all flex flex-col md:flex-row gap-6 md:items-center ${notif.status === 'Unread' ? 'bg-primary/5' : ''}`}
                                >
                                    <div className="flex-shrink-0">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border ${notif.status === 'Unread' ? 'bg-white border-primary/20' : 'bg-gray-50 border-gray-100'}`}>
                                            {getIcon(notif.category, notif.priority)}
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getPriorityStyles(notif.priority)}`}>
                                                {notif.priority}
                                            </span>
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded">
                                                {notif.category}
                                            </span>
                                            <span className="text-sm font-medium text-gray-400">
                                                {new Date(notif.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                        <h4 className="text-xl font-bold text-gray-900">{notif.title}</h4>
                                        <p className="text-gray-600 text-lg max-w-3xl">{notif.message}</p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
                                        {!viewHistory && (
                                            <button
                                                onClick={() => markAsRead(notif.id)}
                                                className="px-6 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-600 hover:bg-gray-100 transition-all"
                                            >
                                                Mark as Read
                                            </button>
                                        )}
                                        <button
                                            onClick={() => navigate(`/pharmacy/notifications/${notif.id}`)}
                                            className="px-8 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                                        >
                                            View Details
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
