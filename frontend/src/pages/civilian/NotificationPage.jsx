import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Bell, CheckCircle, Clock, Filter, AlertCircle, 
    Eye, ChevronRight, Inbox, MailOpen, List, XCircle 
} from 'lucide-react';

const CivilianNotificationPanel = () => {
    const [notifications, setNotifications] = useState([]);
    const [counts, setCounts] = useState({ unread: 0, read: 0 });
    const [activeFilter, setActiveFilter] = useState('ALL');
    const navigate = useNavigate();
    
    // User ID should come from your AuthContext
    const userId = 1; 

    useEffect(() => {
        fetchInitialData();
    }, []);

    // 1. Fetch All Notifications (Default View)
    const fetchInitialData = async () => {
        try {
            setActiveFilter('ALL');
            const res = await fetch(`http://localhost:8080/api/notification?userId=${userId}`);
            const data = await res.json();
            setNotifications(data);
            
            // Calculate global counts for the middle summary cards
            const unread = data.filter(n => !n.isRead).length;
            const read = data.filter(n => n.isRead).length;
            setCounts({ unread, read });
        } catch (err) {
            console.error("Error fetching notifications:", err);
        }
    };

    // 2. Filter by Type (Triggered by Metric Cards)
    const filterByType = async (type) => {
        try {
            setActiveFilter(type); // Matches Enum: 'RESERVATION', 'APPEAL', etc.
            const res = await fetch(`http://localhost:8080/api/notification/type?userId=${userId}&type=${type}`);
            const data = await res.json();
            setNotifications(data);
        } catch (err) {
            console.error("Error filtering by type:", err);
        }
    };

    // 3. Filter by Read Status
    const filterByReadStatus = async (status) => {
        try {
            setActiveFilter(status ? 'READ' : 'UNREAD');
            const res = await fetch(`http://localhost:8080/api/notification/read-status?userId=${userId}&isRead=${status}`);
            const data = await res.json();
            setNotifications(data);
        } catch (err) {
            console.error("Error filtering by status:", err);
        }
    };

    // Color mapping based on design requirements
    const getTypeStyle = (type) => {
        switch(type?.toUpperCase()) {
            case 'RESERVATION': return 'bg-cyan-100 text-[#2FA4A9]'; 
            case 'APPEAL': return 'bg-orange-100 text-orange-600';
            case 'REPORT': return 'bg-purple-100 text-purple-600';
            case 'ACCOUNT': return 'bg-red-100 text-red-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pt-6 pb-12 px-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-black text-[#2FA4A9]">Notifications</h1>
                        <p className="text-slate-500 font-medium text-sm mt-2">Manage all your notifications in one place</p>
                    </div>
                    {activeFilter !== 'ALL' && (
                        <button 
                            onClick={fetchInitialData}
                            className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#2FA4A9] transition-all"
                        >
                            <XCircle size={18} /> Clear Filters
                        </button>
                    )}
                </div>

                {/* Summary Cards - Read / Unread Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div 
                        onClick={() => filterByReadStatus(false)}
                        className={`bg-white p-6 rounded-3xl border flex items-center justify-between cursor-pointer hover:shadow-md transition-all
                            ${activeFilter === 'UNREAD' ? 'border-red-200 ring-2 ring-red-50' : 'border-slate-100'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-50 text-red-500 rounded-2xl"><Inbox size={24}/></div>
                            <div>
                                <p className="text-sm font-bold text-slate-500">Unread Notifications</p>
                                <p className="text-2xl font-black text-slate-800">{counts.unread}</p>
                            </div>
                        </div>
                        <ChevronRight className={activeFilter === 'UNREAD' ? 'text-red-300' : 'text-slate-300'} />
                    </div>
                    <div 
                        onClick={() => filterByReadStatus(true)}
                        className={`bg-white p-6 rounded-3xl border flex items-center justify-between cursor-pointer hover:shadow-md transition-all
                            ${activeFilter === 'READ' ? 'border-teal-200 ring-2 ring-teal-50' : 'border-slate-100'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-teal-50 text-[#2FA4A9] rounded-2xl"><MailOpen size={24}/></div>
                            <div>
                                <p className="text-sm font-bold text-slate-500">Read Notifications</p>
                                <p className="text-2xl font-black text-slate-800">{counts.read}</p>
                            </div>
                        </div>
                        <ChevronRight className={activeFilter === 'READ' ? 'text-[#2FA4A9]' : 'text-slate-300'} />
                    </div>
                </div>

                {/* Notification Table */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#2FA4A9] text-white">
                                <tr>
                                    <th className="p-5 font-bold uppercase text-xs tracking-wider">Type</th>
                                    <th className="p-5 font-bold uppercase text-xs tracking-wider">Title / Subject</th>
                                    <th className="p-5 font-bold uppercase text-xs tracking-wider text-center">Date</th>
                                    <th className="p-5 font-bold uppercase text-xs tracking-wider text-center">Status</th>
                                    <th className="p-5 font-bold uppercase text-xs tracking-wider text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {notifications.length > 0 ? (
                                    notifications.map((notif) => (
                                        <tr key={notif.id} className="hover:bg-teal-50/30 transition-colors group">
                                            <td className="p-5">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getTypeStyle(notif.type)}`}>
                                                    {notif.type}
                                                </span>
                                            </td>
                                            <td className="p-5 font-bold text-slate-700">{notif.title}</td>
                                            <td className="p-5 text-slate-500 text-sm text-center">
                                                {new Date(notif.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-5 text-center">
                                                {notif.isRead ? (
                                                    <span className="inline-flex items-center gap-1.5 text-slate-400 text-xs font-bold bg-slate-100 px-2 py-1 rounded-md">
                                                        <CheckCircle size={12} /> READ
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 text-[#2FA4A9] text-xs font-bold bg-teal-50 px-2 py-1 rounded-md">
                                                        <AlertCircle size={12} className="animate-pulse" /> NEW
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-5 text-center">
                                                <button 
                                                    onClick={() => navigate(`/civilian/notifications/${notif.id}`)}
                                                    className="inline-flex items-center gap-2 bg-[#2FA4A9]/10 text-[#2FA4A9] px-4 py-2 rounded-xl font-bold text-xs hover:bg-[#2FA4A9] hover:text-white transition-all shadow-sm"
                                                >
                                                    <Eye size={14} /> View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-10 text-center text-slate-400 font-bold italic">
                                            No notifications found for this filter.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CivilianNotificationPanel;