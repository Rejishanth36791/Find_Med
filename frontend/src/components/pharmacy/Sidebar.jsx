import { NavLink } from 'react-router-dom'
import { Home, LayoutDashboard, Package, History, Pill, Bell, Settings, MessageSquare, PieChart, User } from 'lucide-react'
import logo from '../../assets/logo.jpg'

const menuItems = [
    { name: 'Home', icon: Home, path: '/', end: true },
    { name: 'Dashboard', icon: LayoutDashboard, path: '/pharmacy', end: true },
    { name: 'Current Reservations', icon: Package, path: '/pharmacy/current-reservations' },
    { name: 'Reservation History', icon: History, path: '/pharmacy/reservation-history' },
    { name: 'Inventory Management', icon: Pill, path: '/pharmacy/inventory' },
    { name: 'Reports', icon: PieChart, path: '/pharmacy/reports' },
    { name: 'Notification Center', icon: Bell, path: '/pharmacy/notifications' },
    { name: 'Contact Admin', icon: MessageSquare, path: '/pharmacy/admin-center' },
    { name: 'Pharmacy Profile', icon: User, path: '/pharmacy/profile' },
    { name: 'System Settings', icon: Settings, path: '/pharmacy/settings' },
]

export default function Sidebar() {
    return (
        <div className="fixed left-0 top-0 h-screen w-64 bg-sidebar-bg text-sidebar-text flex flex-col shadow-xl transition-colors duration-300">
            <div className="p-6 border-b border-current/10">
                <div className="flex items-center gap-3">
                    <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
                    <div className="flex flex-col">
                        <h1 className="text-xl font-black tracking-tight leading-tight">FindMyMeds</h1>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 leading-tight">Pharmacy Portal</p>
                    </div>
                </div>
            </div>
            <nav className="flex-1 p-4 space-y-2 mt-4">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-bold text-sm ${isActive
                                    ? 'bg-sidebar-text text-sidebar-bg shadow-lg shadow-black/10'
                                    : 'hover:bg-current/10 text-sidebar-text/80 hover:text-sidebar-text'
                                }`
                            }
                        >
                            <Icon size={18} />
                            <span>{item.name}</span>
                        </NavLink>
                    )
                })}
            </nav>
            <div className="p-6 text-[10px] font-black uppercase tracking-widest opacity-40 border-t border-current/10 text-center">
                © 2026 FindMyMeds
            </div>
        </div>
    )
}

