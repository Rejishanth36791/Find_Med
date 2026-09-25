import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Use state to track active navigation
  const [activeItem, setActiveItem] = useState('Overview');

  // Map route paths to sidebar item names to keep standard highlighting
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/dashboard')) setActiveItem('Overview');
    else if (path.includes('/civilians')) setActiveItem('Civilians');
    else if (path.includes('/pharmacies')) setActiveItem('Pharmacies');
    else if (path.includes('/administrators')) setActiveItem('Administrators');
    else if (path.includes('/medicines')) setActiveItem('Medicine Registry');
    else if (path.includes('/profile')) setActiveItem('Profile');
    else if (path.includes('/settings')) setActiveItem('Settings');
  }, [location]);

  const handleNavigation = (itemName) => {
    setActiveItem(itemName);
    switch (itemName) {
      case 'Overview':
        navigate('/admin/dashboard');
        break;
      case 'Civilians':
        navigate('/admin/civilians');
        break;
      case 'Pharmacies':
        navigate('/admin/pharmacies');
        break;
      case 'Administrators':
        navigate('/admin/administrators');
        break;
      case 'Medicine Registry':
        navigate('/admin/medicines');
        break;
      case 'Profile':
        navigate('/admin/profile');
        break;
      case 'Settings':
        navigate('/admin/settings');
        break;
      default:
        break;
    }
  };

  const menuGroups = [
    {
      title: 'Dashboard',
      items: [
        { name: 'Overview', icon: 'fa-solid fa-chart-pie' },
      ]
    },
    {
      title: 'Management',
      items: [
        { name: 'Civilians', icon: 'fa-solid fa-users' },
        { name: 'Pharmacies', icon: 'fa-solid fa-store' },
        { name: 'Administrators', icon: 'fa-solid fa-user-shield' },
        { name: 'Medicine Registry', icon: 'fa-solid fa-book-medical' },
      ]
    },
    {
      title: 'Account',
      items: [
        { name: 'Profile', icon: 'fa-solid fa-user' },
        { name: 'Settings', icon: 'fa-solid fa-sliders' },
      ]
    }
  ];

  return (
    <aside className="w-[260px] h-screen bg-white border-r border-slate-100 flex flex-col p-6 shadow-sm">
      {/* Brand Section */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <img src="/logo.jpeg" alt="Logo" className="w-9 h-9 object-cover rounded-lg shadow-sm" />
        <span className="text-xl font-extrabold text-slate-900 tracking-tight">FindMyMeds</span>
      </div>

      {/* Navigation */}
      <nav className="flex-grow space-y-6">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-3">
              {group.title}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = activeItem === item.name;
                return (
                  <li key={item.name}>
                    <button
                      onClick={() => handleNavigation(item.name)}
                      className={`w-full flex items-center gap-4 px-4 py-3 transition-all duration-200 text-sm relative group
                        ${isActive
                          ? 'bg-[#E0F2F1] text-primary font-bold rounded-r-xl'
                          : 'text-slate-500 font-semibold hover:bg-slate-50 hover:text-slate-900 rounded-xl'
                        }`}
                    >
                      {/* Active Indicator Strip */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-primary rounded-r-full" />
                      )}

                      <i className={`${item.icon} w-5 text-center text-base ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'}`}></i>
                      {item.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <button
        onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          navigate('/admin/u/login');
        }}
        className="flex items-center gap-4 px-4 py-3 text-sm font-bold text-slate-500 hover:text-red-500 transition-colors mt-auto group"
      >
        <i className="fa-solid fa-right-from-bracket group-hover:-translate-x-1 transition-transform"></i>
        Logout
      </button>
    </aside >
  );
};

export default Sidebar;