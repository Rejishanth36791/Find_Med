import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, CheckCircle, Clock, AlertCircle, 
    Filter, Bell, FileText, Calendar, Tag, Download 
} from 'lucide-react';

const CivilianNotificationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);

    // User ID should ideally come from your AuthContext
    const userId = 1;

    useEffect(() => {
        fetchNotificationDetails();
    }, [id]);

    const fetchNotificationDetails = async () => {
        try {
            setLoading(true);
            // Fetch single notification by ID
            const res = await fetch(`http://localhost:8080/api/notification/${id}?userId=${userId}`);
            if (res.ok) {
                const data = await res.json();
                setNotification(data);
            } else {
                console.error("Failed to fetch notification");
            }
        } catch (err) {
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async () => {
        try {
            // Update the notification status to read
            const res = await fetch(`http://localhost:8080/api/notification/${id}/read?userId=${userId}`, {
                method: 'PUT'
            });
            if (res.ok) {
                // Refresh local state to show "Read" badge
                setNotification({ ...notification, isRead: true });
            }
        } catch (err) {
            console.error("Error marking as read:", err);
        }
    };

    const getTypeBadge = (type) => {
        const baseClass = "flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider";
        switch(type?.toUpperCase()) {
            case 'RESERVATION': 
                return <span className={`${baseClass} bg-cyan-100 text-[#2FA4A9]`}><Clock size={14}/> Reservation</span>;
            case 'APPEAL': 
                return <span className={`${baseClass} bg-orange-100 text-orange-600`}><AlertCircle size={14}/> Appeal</span>;
            case 'REPORT': 
                return <span className={`${baseClass} bg-purple-100 text-purple-600`}><Filter size={14}/> Report / Inquiry</span>;
            case 'ACCOUNT': 
                return <span className={`${baseClass} bg-red-100 text-red-600`}><Bell size={14}/> Account / System</span>;
            default: 
                return <span className={`${baseClass} bg-slate-100 text-slate-600`}>Notification</span>;
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2FA4A9]"></div>
        </div>
    );

    if (!notification) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
            <p className="text-slate-500 font-bold">Notification not found.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50/50 pt-6 pb-12 px-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[#2FA4A9]">Notification Details</h1>
                        <p className="text-slate-500 font-medium italic">View the full details of this notification and take necessary actions.</p>
                    </div>
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-400 hover:text-[#2FA4A9] font-bold text-sm transition-colors group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
                        Back to Notifications
                    </button>
                </div>

                {/* Main Content Card  */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                    <div className="p-8 sm:p-12 space-y-8">
                        
                        {/* Meta Info: Type and Date */}
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-50 pb-6">
                            {getTypeBadge(notification.type)}
                            <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                                <Calendar size={16} />
                                <span>Date: {new Date(notification.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Title & Description [cite: 214, 216] */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-black text-slate-800 leading-tight">
                                {notification.title}
                            </h2>
                            <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                                <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                                    {notification.description}
                                </p>
                            </div>
                        </div>

                        {/* Related Reference Section [cite: 345, 360] */}
                        {notification.relatedId && (
                            <div className="flex items-center gap-3 p-4 bg-teal-50/50 rounded-2xl border border-teal-100/50">
                                <Tag size={18} className="text-[#2FA4A9]" />
                                <span className="text-sm font-bold text-slate-600">
                                    Related {notification.type} ID: 
                                    <span className="text-[#2FA4A9] ml-2 font-black">#{notification.relatedId}</span>
                                </span>
                            </div>
                        )}

                        {/* Attachments Section [cite: 219, 346] */}
                        {notification.attachments && notification.attachments.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <FileText size={16} /> Attachments
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {notification.attachments.map((file, index) => (
                                        <a 
                                            key={index}
                                            href={file.url}
                                            download
                                            className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-[#2FA4A9] hover:shadow-md transition-all group"
                                        >
                                            <span className="text-sm font-bold text-slate-600 truncate mr-4">{file.fileName}</span>
                                            <Download size={18} className="text-slate-300 group-hover:text-[#2FA4A9]" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions [cite: 220, 346] */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                            {!notification.isRead && (
                                <button 
                                    onClick={markAsRead}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#2FA4A9] text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-[#258d91] transition-all shadow-lg shadow-[#2FA4A9]/20"
                                >
                                    <CheckCircle size={18} /> Mark as Read
                                </button>
                            )}
                            {notification.isRead && (
                                <div className="flex items-center gap-2 text-teal-600 font-black text-sm bg-teal-50 px-6 py-4 rounded-2xl border border-teal-100">
                                    <CheckCircle size={18} /> Viewed & Acknowledged
                                </div>
                            )}
                            <button 
                                onClick={() => navigate(-1)}
                                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm text-slate-400 hover:bg-slate-100 transition-all text-center"
                            >
                                Back to Panel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CivilianNotificationDetails;