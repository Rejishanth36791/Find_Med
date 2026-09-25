import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, CheckCircle, Clock, FileText, User,
    Shield, Activity, Calendar, Hash
} from 'lucide-react';

const AdminNotificationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotification();
    }, [id]);

    const fetchNotification = async () => {
        try {
            const res = await fetch(`http://localhost:8081/api/notifications/${id}`);
            if (res.ok) {
                setNotification(await res.json());
            } else {
                navigate('/admin/notifications'); // Redirect if not found
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async () => {
        try {
            await fetch(`http://localhost:8081/api/notifications/${id}/read`, { method: 'PUT' });
            fetchNotification(); // Refresh state
        } catch (e) {
            console.error("Error marking as read", e);
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Loading details...</div>;
    if (!notification) return null;

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            {/* Header / Nav */}
            <button
                onClick={() => navigate('/admin/notifications')}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
            >
                <ChevronLeft size={16} /> Back to Notification Center
            </button>

            {/* Main Content Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header Strip */}
                <div className={`h-2 w-full ${notification.read ? 'bg-gray-200' : 'bg-teal-500'}`} />

                <div className="p-8">
                    {/* Title Section */}
                    <div className="flex justify-between items-start gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded uppercase tracking-wider">
                                    {notification.notificationType}
                                </span>
                                {notification.read ? (
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                                        <CheckCircle size={12} /> Read
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                                        <Clock size={12} /> Unread
                                    </span>
                                )}
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">{notification.title}</h1>
                        </div>
                        <div className="text-right text-xs text-gray-400">
                            <p>Notification ID</p>
                            <p className="font-mono mt-1 text-gray-500">#{notification.id}</p>
                        </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-6 bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
                        <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Target Role</p>
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Shield size={16} className="text-indigo-500" />
                                {notification.targetRole}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Created At</p>
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Calendar size={16} className="text-indigo-500" />
                                {new Date(notification.createdAt).toLocaleString()}
                            </div>
                        </div>
                        {notification.relatedEntityId && (
                            <div className="col-span-2 pt-4 border-t border-gray-200">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Related Entity</p>
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <Hash size={16} className="text-gray-400" />
                                    <span className="font-mono">
                                        {notification.relatedEntityType || 'ENTITY'} #{notification.relatedEntityId}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content Body */}
                    <div className="prose prose-sm max-w-none text-gray-600">
                        <h3 className="text-sm font-bold text-gray-900 mb-2">Message</h3>
                        <p className="leading-relaxed whitespace-pre-wrap">{notification.message}</p>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-3">
                        {!notification.read && (
                            <button
                                onClick={handleMarkAsRead}
                                className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-2"
                            >
                                <CheckCircle size={16} />
                                Mark as Read
                            </button>
                        )}
                        {notification.read && (
                            <div className="text-xs text-gray-400 flex flex-col items-end justify-center">
                                <span>Read on</span>
                                <span className="font-medium text-gray-500">
                                    {notification.readAt ? new Date(notification.readAt).toLocaleString() : 'Just now'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <p className="text-center text-xs text-gray-400 mt-6">
                Read notifications are automatically deleted after 7 days.
            </p>
        </div>
    );
};

export default AdminNotificationDetails;
