import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/pharmacy/Layout';
import { useNotifications } from '../../context/NotificationContext';
import {
    ArrowLeft,
    ExternalLink,
    CheckCircle2,
    Clock,
    AlertTriangle,
    AlertCircle,
    Info,
    ShoppingBag,
    Package,
    Calendar,
    Settings
} from 'lucide-react';

export default function NotificationDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { notifications, markAsRead } = useNotifications();

    const notification = useMemo(() =>
        notifications.find(n => n.id === id),
        [notifications, id]);

    if (!notification) {
        return (
            <Layout title="Notification Not Found">
                <div className="flex flex-col items-center justify-center p-20">
                    <h2 className="text-2xl font-bold text-gray-800">Notification not found</h2>
                    <button onClick={() => navigate('/pharmacy/notifications')} className="mt-4 text-primary font-bold hover:underline">
                        Back to Center
                    </button>
                </div>
            </Layout>
        );
    }

    const getIcon = (category, priority) => {
        if (priority === 'Critical') return <AlertCircle className="text-red-500" size={48} />;
        if (priority === 'Warning') return <AlertTriangle className="text-orange-500" size={48} />;

        switch (category) {
            case 'Reservations': return <ShoppingBag className="text-blue-500" size={48} />;
            case 'Inventory': return <Package className="text-orange-500" size={48} />;
            case 'Expiry & Stock': return <Calendar className="text-red-500" size={48} />;
            case 'Admin & System': return <Settings className="text-purple-500" size={48} />;
            default: return <Info className="text-blue-500" size={48} />;
        }
    };

    const handleAction = () => {
        markAsRead(notification.id);
        navigate(notification.link);
    };

    return (
        <Layout title="Notification Details">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-bold mb-8 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Notifications
                </button>

                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                    {/* Header Section */}
                    <div className="p-10 border-b border-gray-50 flex items-start gap-8">
                        <div className="p-6 bg-gray-50 rounded-2xl shadow-inner">
                            {getIcon(notification.category, notification.priority)}
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${notification.priority === 'Critical' ? 'bg-red-100 text-red-600' :
                                    notification.priority === 'Warning' ? 'bg-orange-100 text-orange-600' :
                                        'bg-blue-100 text-blue-600'
                                    }`}>
                                    {notification.priority} Priority
                                </span>
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                    {notification.category}
                                </span>
                            </div>
                            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                                {notification.title}
                            </h1>
                            <div className="flex items-center gap-2 text-gray-500 font-medium">
                                <Clock size={16} />
                                {new Date(notification.timestamp).toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-10 space-y-10">
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 italic text-xl text-gray-700 leading-relaxed shadow-sm">
                            "{notification.message}"
                        </div>

                        {/* Granular Data Table */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <Info size={24} className="text-primary" />
                                Comprehensive Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(notification.data || {}).map(([key, value]) => (
                                    <div key={key} className="bg-white border border-gray-200 rounded-xl p-6 flex justify-between items-center shadow-sm">
                                        <span className="text-sm font-black text-gray-400 uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</span>
                                        <span className="text-lg font-bold text-gray-900">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <button
                                onClick={handleAction}
                                className="flex-1 bg-primary text-white font-black text-xl py-5 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-4"
                            >
                                <ExternalLink size={24} />
                                Go to Relevant Page
                            </button>
                            {notification.status === 'Unread' && (
                                <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="px-10 py-5 rounded-2xl border-4 border-gray-100 font-black text-xl text-gray-400 hover:border-green-100 hover:text-green-600 hover:bg-green-50/50 transition-all flex items-center justify-center gap-4"
                                >
                                    <CheckCircle2 size={24} />
                                    Mark as Read
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
