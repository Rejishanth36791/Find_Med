import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Home,
    LayoutDashboard,
    Search,
    MessageSquare,
    LogOut,
    Menu,
    X,
    Bell
} from 'lucide-react';

// Import logo from assets
import LogoImg from '../../assets/logo.jpg'; 

const CivilianNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const menuItems = [
        { icon: Home, label: 'Home', path: '/civilian/home' },
        { icon: LayoutDashboard, label: 'My Activity', path: '/civilian/dashboard' },
        { icon: Search, label: 'Reserve Medicine', path: '/civilian/reservation' },
        { icon: Bell, label: 'Notifications', path: '/civilian/notifications' },
        { icon: MessageSquare, label: 'Appeals & Feedbacks', path: '/civilian/appeals-reports' },
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-500 ${
            scrolled ? 'bg-white/90 backdrop-blur-lg shadow-md h-16' : 'bg-white h-20'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex justify-between items-center h-full">
                    
                    {/* Logo Section */}
                    <div className="flex items-center">
                        <Link to="/civilian/home" className="flex-shrink-0 flex items-center group">
                            <div className="relative">
                                <img 
                                    src={LogoImg} 
                                    alt="FindMyMeds Logo" 
                                    className="h-10 w-10 object-contain transition-transform duration-500 group-hover:scale-110" 
                                />
                                <div className="absolute inset-0 bg-[#2FA4A9]/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                            <span className="ml-3 font-black text-2xl tracking-tighter text-[#2FA4A9]">
                                FindMyMeds
                            </span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:ml-10 md:flex md:space-x-1">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`relative px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 group ${
                                        isActive(item.path)
                                            ? 'text-[#2FA4A9]'
                                            : 'text-[#2FA4A9]/60 hover:text-[#2FA4A9]'
                                    }`}
                                >
                                    <div className="flex items-center relative z-10">
                                        <item.icon className={`w-4 h-4 mr-2 transition-transform duration-300 ${isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'}`} />
                                        {item.label}
                                    </div>
                                    {isActive(item.path) && (
                                        <div className="absolute inset-0 bg-[#2FA4A9]/10 rounded-full border border-[#2FA4A9]/20"></div>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Side Action - Improved Light Logout Button */}
                    <div className="hidden md:flex items-center">
                        <button
                            onClick={handleLogout}
                            className="group inline-flex items-center justify-center px-6 py-2.5 font-bold text-[#2FA4A9] bg-[#2FA4A9]/10 rounded-full border border-[#2FA4A9]/20 transition-all duration-300 hover:bg-[#2FA4A9] hover:text-white hover:shadow-lg hover:shadow-[#2FA4A9]/30 focus:outline-none active:scale-95"
                        >
                            <LogOut className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:translate-x-1" />
                            <span>Logout</span>
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-xl text-[#2FA4A9] hover:bg-[#2FA4A9]/10 transition-all focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu panel */}
            <div className={`md:hidden absolute w-full bg-white transition-all duration-300 ease-in-out border-b border-[#2FA4A9]/10 ${
                isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
            }`}>
                <div className="pt-2 pb-6 space-y-1 px-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center px-4 py-4 rounded-2xl text-base font-bold transition-all ${
                                isActive(item.path)
                                    ? 'bg-[#2FA4A9] text-white shadow-lg'
                                    : 'text-[#2FA4A9]/70 hover:bg-[#2FA4A9]/5 hover:text-[#2FA4A9]'
                            }`}
                        >
                            <item.icon className="w-5 h-5 mr-4" />
                            {item.label}
                        </Link>
                    ))}
                    <div className="pt-4 mt-4 border-t border-[#2FA4A9]/10">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                handleLogout();
                            }}
                            className="w-full flex items-center px-4 py-4 rounded-2xl text-base font-bold text-[#2FA4A9] bg-[#2FA4A9]/10 hover:bg-[#2FA4A9] hover:text-white transition-all"
                        >
                            <LogOut className="w-5 h-5 mr-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default CivilianNavbar;