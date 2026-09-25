import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Info, AlertCircle, Clock } from 'lucide-react';

const NotificationPanel = ({ notifications = [] }) => {
  const navigate = useNavigate();

  // Logic: Filter for unread and take only the latest 5
  const displayNotifications = notifications
    .filter(note => !note.isRead)
    .slice(0, 5);

  const handleNotificationClick = (id) => {
    navigate(`/admin/notifications/${id}`);
  };

  const handleViewAll = () => {
    navigate('/admin/notification-center');
  };

  return (
    <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
      
      {/* HEADER - Slimmer for narrow sidebar */}
      <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-[#2FA4A9] rounded-lg shadow-md shadow-[#2FA4A9]/20">
            <Bell size={14} className="text-white" />
          </div>
          <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">
            Recent Alerts
          </h3>
        </div>
        {displayNotifications.length > 0 && (
          <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
        )}
      </div>

      {/* NOTIFICATIONS LIST - Tighter Spacing */}
      <div className="flex-1 overflow-y-auto p-2 
                      [&::-webkit-scrollbar]:w-1 
                      [&::-webkit-scrollbar-thumb]:bg-[#2FA4A9]/10 
                      [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        {displayNotifications.length > 0 ? (
          <div className="space-y-2">
            {displayNotifications.map((note) => (
              <div 
                key={note.id} 
                onClick={() => handleNotificationClick(note.id)}
                className="relative p-3 rounded-xl border border-slate-50 bg-white 
                           hover:bg-[#2FA4A9]/5 hover:border-[#2FA4A9]/10 
                           transition-all duration-200 group cursor-pointer 
                           active:scale-[0.98]"
              >
                <div className="flex items-start space-x-2">
                  <div className={`mt-0.5 p-1 rounded-md 
                    ${note.message.toLowerCase().includes('warning') 
                      ? 'bg-rose-50 text-rose-500' 
                      : 'bg-[#2FA4A9]/10 text-[#2FA4A9]'}`}
                  >
                    {note.message.toLowerCase().includes('warning') ? <AlertCircle size={12} /> : <Info size={12} />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-slate-700 leading-[1.3] truncate group-hover:whitespace-normal">
                      {note.message}
                    </p>
                    <div className="flex items-center mt-1 text-[8px] font-black uppercase tracking-tighter text-slate-400">
                      <Clock size={8} className="mr-1" />
                      <span>{note.time || "New"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 opacity-20">
            <Bell size={24} className="text-slate-400 mb-1" />
            <p className="text-[8px] font-black uppercase tracking-widest text-center">All Caught Up</p>
          </div>
        )}
      </div>

      {/* FOOTER - Guides to Notification Center */}
      <button 
        onClick={handleViewAll}
        className="w-full py-3 text-[9px] font-black text-[#2FA4A9] uppercase tracking-[0.2em] hover:bg-[#2FA4A9] hover:text-white transition-all border-t border-slate-50"
      >
        View Center
      </button>
    </div>
  );
};

export default NotificationPanel;