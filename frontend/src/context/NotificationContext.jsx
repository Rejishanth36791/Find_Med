import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/pharmacy/notifications', {
                params: { page: 0, size: 100 }
            });
            if (response.data?.content) {
                const mapped = response.data.content.map(notif => ({
                    id: notif.id.toString(),
                    title: notif.title,
                    message: notif.message,
                    timestamp: notif.createdAt,
                    status: notif.read ? 'Read' : 'Unread',
                    priority: mapPriority(notif.priority),
                    category: mapTypeToCategory(notif.type),
                    link: mapTypeToLink(notif.type, notif.relatedEntityId),
                    data: {
                        id: notif.id,
                        relatedId: notif.relatedEntityId,
                        type: notif.type
                    }
                }));
                setNotifications(mapped);
            }
        } catch (err) {
            console.error("Error fetching notifications:", err);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await api.get('/pharmacy/notifications/unread-count');
            setUnreadCount(response.data);
        } catch (err) {
            console.error("Error fetching unread count:", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();
        const interval = setInterval(() => {
            fetchNotifications();
            fetchUnreadCount();
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id) => {
        try {
            const res = await api.put(`/pharmacy/notifications/${id}/read`);
            if (res.status === 200 || res.status === 204) {
                fetchNotifications();
                fetchUnreadCount();
            }
        } catch (err) {
            console.error("Error marking as read:", err);
        }
    };

    const mapPriority = (p) => {
        if (p === 'CRITICAL') return 'Critical';
        if (p === 'WARNING') return 'Warning';
        return 'Info';
    };

    const mapTypeToCategory = (type) => {
        switch (type) {
            case 'RESERVATION': return 'Reservations';
            case 'MEDICINE': return 'Inventory';
            case 'PHARMACY': return 'Expiry & Stock';
            default: return 'Admin & System';
        }
    };

    const mapTypeToLink = (type, id) => {
        switch (type) {
            case 'RESERVATION': return `/pharmacy/reservations/${id}`;
            case 'MEDICINE': return '/pharmacy/inventory';
            case 'PHARMACY': return '/pharmacy/expiry';
            default: return '/pharmacy/settings';
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotifications = () => useContext(NotificationContext);
