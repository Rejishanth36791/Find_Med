import React from 'react';
import NotificationBell from './NotificationBell';

export default function Header({ title }) {
    return (
        <header className="fixed top-0 left-64 right-0 h-16 bg-content-bg border-b border-sidebar-bg/10 flex items-center justify-between px-8 z-10 shadow-sm transition-colors duration-300">
            <h2 className="text-2xl font-semibold text-sidebar-bg">{title}</h2>
            <div className="flex items-center gap-6">
                <NotificationBell />
            </div>
        </header>
    )
}

