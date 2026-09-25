import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import CivilianNavbar from './CivilianNavbar';
import BanNotificationModal from './BanNotificationModal';

const CivilianLayout = () => {
    const [isBanModalOpen, setIsBanModalOpen] = useState(false);
    const [banDetails, setBanDetails] = useState({ reason: '', date: null });

    useEffect(() => {
        const userStr = localStorage.getItem('civilian_user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.accountStatus === 'TEMP_BANNED') {
                    setBanDetails({
                        reason: user.banReason,
                        date: user.banDate
                    });
                    setIsBanModalOpen(true);
                }
            } catch (e) {
                console.error("Error parsing user details", e);
            }
        }
    }, []);

    return (
        <div className="flex flex-col h-screen bg-gray-50 font-sans">
            <CivilianNavbar />
            <main className="flex-1 overflow-y-auto mt-16 p-4 md:p-8">
                <Outlet />
            </main>
            <BanNotificationModal
                isOpen={isBanModalOpen}
                onClose={() => setIsBanModalOpen(false)}
                banReason={banDetails.reason}
                banDate={banDetails.date}
            />
        </div>
    );
};

export default CivilianLayout;
