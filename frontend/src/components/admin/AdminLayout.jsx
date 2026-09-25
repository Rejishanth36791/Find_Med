import React from 'react';
import { Outlet } from 'react-router-dom';
import HomeAdminSidebar from './HomeAdminSidebar';
import HomeAdminHeader from './HomeAdminHeader';

const AdminLayout = () => {
  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden font-['Inter']">
      {/* 1. Sidebar remains locked on the left */}
      <HomeAdminSidebar />
      
      {/* 2. Vertical flex container for the right side */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* 3. Fixed Header - Padding adjusted to px-10 for left-alignment */}
        <div className="bg-[#F8FAFC] z-20 px-10">
          <HomeAdminHeader />
        </div>

        {/* 4. Scrollable Area - Padding matches Header for perfect alignment */}
        <main className="flex-1 overflow-y-auto scroll-smooth px-10 pb-10">
          <div className="max-w-[1600px]">
            <Outlet /> 
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;