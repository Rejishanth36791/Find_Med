import React, { useState, useRef, useEffect } from 'react';
import { Bell, Info, AlertTriangle, AlertCircle, ShoppingBag, Package, Calendar, Settings } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

export default function NotificationBell() {
    const { notifications, unreadCount, markAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const latestNotifications = notifications
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getIcon = (category, priority) => {
        if (priority === 'Critical') return <AlertCircle className="text-red-500" size={20} />;
        if (priority === 'Warning') return <AlertTriangle className="text-orange-500" size={20} />;

        switch (category) {
            case 'Reservations': return <ShoppingBag className="text-blue-500" size={20} />;
            case 'Inventory': return <Package className="text-orange-500" size={20} />;
            case 'Expiry & Stock': return <Calendar className="text-red-500" size={20} />;
            case 'Admin & System': return <Settings className="text-purple-500" size={20} />;
            default: return <Info className="text-blue-500" size={20} />;
        }
    };

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHrs = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHrs / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} mins ago`;
        if (diffHrs < 24) return `${diffHrs} hours ago`;
        return `${diffDays} days ago`;
    };

    const handleNotificationClick = (notif) => {
        setIsOpen(false);
        navigate(`/pharmacy/notifications/${notif.id}`);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Notifications"
            >
                <Bell size={24} className="text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-bold text-gray-800">Recent Notifications</h3>
                        <button
                            onClick={() => { setIsOpen(false); navigate('/pharmacy/notifications'); }}
                            className="text-xs font-semibold text-primary hover:underline"
                        >
                            View All
                        </button>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {latestNotifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                No notifications yet
                            </div>
                        ) : (
                            latestNotifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => handleNotificationClick(notif)}
                                    className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors flex gap-4 ${notif.status === 'Unread' ? 'bg-primary/5' : ''}`}
                                >
                                    <div className="mt-1">
                                        {getIcon(notif.category, notif.priority)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <p className={`text-sm ${notif.status === 'Unread' ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                                                {notif.title}
                                            </p>
                                            <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                                                {formatTime(notif.timestamp)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                            {notif.message}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-3 text-center border-t border-gray-100">
                        <button
                            onClick={() => { setIsOpen(false); navigate('/pharmacy/notifications'); }}
                            className="text-sm font-bold text-gray-600 hover:text-primary transition-colors"
                        >
                            Notification Center
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
