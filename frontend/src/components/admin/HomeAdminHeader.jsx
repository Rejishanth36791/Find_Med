import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldCheck, ChevronDown } from 'lucide-react';

const HomeAdminHeader = ({ title, userName = "Chetto", role = "Super Admin" }) => {
  const location = useLocation();

  const derivedTitle = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith('/admin/pharmacy/rejected/')) return 'Rejected Pharmacy';
    if (path === '/admin/pharmacy/rejected') return 'Rejected Pharmacies';
    if (path.startsWith('/admin/pharmacies/')) return 'Pharmacy Details';
    if (path === '/admin/pharmacies') return 'Pharmacies';
    if (path.startsWith('/admin/pharmacy-review/')) return 'Pharmacy Review';
    if (path.startsWith('/admin/reports/')) return 'Report Details';
    if (path === '/admin/reports') return 'Pharmacy Reports';
    if (path.startsWith('/admin/medicines/')) return 'Medicine Details';
    if (path === '/admin/medicines') return 'Medicine Registry';
    if (path === '/admin/medicines/add') return 'Add Medicine';
    if (path === '/admin/administrators') return 'Administrators';
    if (path === '/admin/civilians') return 'Civilians';
    if (path.startsWith('/admin/notifications/')) return 'Notification Details';
    if (path === '/admin/notifications') return 'Notifications';
    if (path === '/admin/settings') return 'System Settings';
    if (path === '/admin/profile') return 'Profile';
    if (path === '/admin/dashboard' || path === '/admin') return 'Dashboard';
    return 'Overview';
  }, [location.pathname]);

  const headerTitle = title || derivedTitle;
  return (
    <header className="flex justify-between items-center py-5 bg-transparent mb-2">
      
      {/* Dynamic Page Title - No extra labels, just the core Topic */}
      <div className="flex items-center space-x-4">
        {/* Medical Brand Accent (match PharmacyManagementHome header) */}
        <div className="w-2 h-10 bg-gradient-to-b from-[#2FA4A9] to-[#2FA4A9]/20 rounded-full shadow-[0_0_15px_rgba(47,164,169,0.2)]"></div>

        <h1 className="text-3xl font-[1000] text-[#2FA4A9] tracking-tight uppercase leading-none">
          {headerTitle}
        </h1>
      </div>

      {/* User Profile Section - Clean & High-End */}
      <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 hover:border-[#2FA4A9]/30 transition-all duration-300 group cursor-pointer">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-black text-slate-700 leading-none mb-1 group-hover:text-[#2FA4A9] transition-colors">
            {userName}
          </p>
          <div className="flex items-center justify-end space-x-1.5">
            <ShieldCheck size={11} className="text-[#2FA4A9]" />
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              {role}
            </p>
          </div>
        </div>
        
        {/* Profile Avatar with Squircle Design */}
        <div className="relative">
          <div className="w-10 h-10 bg-[#2FA4A9] rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-[#2FA4A9]/20 transform group-hover:scale-105 transition-all">
            {userName.charAt(0)}
          </div>
          {/* Active Status Dot */}
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
        </div>

        <ChevronDown size={14} className="text-slate-300 group-hover:text-[#2FA4A9] transition-colors ml-1" />
      </div>
    </header>
  );
};

export default HomeAdminHeader;