import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../pharmacy/Sidebar';

const PharmacyLayout = () => {
    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar />

            <div className="flex-1 flex flex-col p-8 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default PharmacyLayout;
