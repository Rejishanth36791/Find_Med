import React from 'react';
import { PlusCircle, FileText, Mail, Zap } from 'lucide-react';

const HomeQuickAccess = () => {
  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col justify-center h-full">
      <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold">
        <Zap size={18} className="text-amber-500 fill-amber-500" />
        <span className="text-xs uppercase tracking-wider">Quick Access</span>
      </div>

      <div className="flex flex-col gap-2">
        {/* Super Admin Action */}
        <button className="flex items-center justify-center gap-2 w-full py-3 bg-[#d32f2f] text-white font-bold rounded-xl hover:bg-red-700 hover:shadow-lg hover:shadow-red-200 transition-all active:scale-95 text-sm">
          <PlusCircle size={16} />
          Register New Admin
        </button>

        <button className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-200 transition-all active:scale-95 text-sm">
          <FileText size={16} />
          Generate Reports
        </button>

        <button className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 text-slate-600 border border-slate-200 font-bold rounded-xl hover:bg-white hover:border-theme transition-all active:scale-95 text-sm">
          <Mail size={16} />
          View Inquiries
        </button>
      </div>
    </div>
  );
};


export default HomeQuickAccess;