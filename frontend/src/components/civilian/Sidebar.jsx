
// This needs to be a new file since it doesn't exist where CivilianLayout expects it.
// I'll create components/civilian/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Search, FileText } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { name: 'My Activity', path: '/civilian/activity', icon: <LayoutDashboard size={20} /> },
        { name: 'Find Pharmacy', path: '/civilian/find-pharmacy', icon: <Search size={20} /> },
        { name: 'Reservations', path: '/civilian/reservation', icon: <FileText size={20} /> },
    ];

    return (
        <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
            <div className="p-6">
                <h1 className="text-xl font-bold text-teal-600">FindMyMeds</h1>
                <p className="text-sm text-gray-500">Civilian Portal</p>
            </div>
            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? 'bg-teal-50 text-teal-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        {item.icon}
                        {item.name}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
