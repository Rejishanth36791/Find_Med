import React from 'react';
import { Bell } from 'lucide-react';

const HomeAlertCard = ({ data }) => {
  return (
    <div className="bg-primary rounded-[2rem] p-6 shadow-xl shadow-primary/20 text-white relative overflow-hidden flex flex-col justify-between h-full min-h-[180px]">
      {/* Header */}
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold opacity-90">Pending Alerts</h3>
        <Bell className="opacity-80" size={24} />
      </div>

      {/* Content Row */}
      <div className="flex items-end justify-between mt-2">
        <h2 className="text-6xl font-[900] leading-none tracking-tighter">
          {data ? data.totalAlerts : 0}
        </h2>

        <div className="mb-2">
          <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold shadow-sm">
            Update: Just now
          </span>
        </div>
      </div>

      {/* Footer Details */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-sm font-medium opacity-90 truncate">
          {data ? data.pendingAppeals : 0} Civilian Appeals / {data ? data.pendingPharmacyApprovals : 0} Pharma Requests
        </p>
      </div>
    </div>
  );
};

export default HomeAlertCard;