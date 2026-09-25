import React from "react";
import { Zap, ChevronRight, ShieldCheck, Activity } from "lucide-react";

const QuickActionPanel = ({ actions = [] }) => {
  return (
    <div className="bg-white/90 backdrop-blur-xl border border-slate-100 rounded-[2rem] p-6 shadow-xl shadow-slate-200/40 relative overflow-hidden">
      
      {/* Brand Glow Decoration */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#2FA4A9] opacity-[0.08] rounded-full blur-2xl"></div>

      {/* --- PANEL HEADER --- */}
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2.5 bg-[#2FA4A9]/10 rounded-xl text-[#2FA4A9] border border-[#2FA4A9]/20">
          <ShieldCheck size={18} />
        </div>
        <div>
          <h3 className="text-[9px] font-[1000] text-slate-400 uppercase tracking-[0.2em] leading-none">
            System Control
          </h3>
          <p className="text-xs font-[1000] text-slate-700 uppercase tracking-tight mt-1">
            Quick Launcher
          </p>
        </div>
      </div>

      {/* --- COMPACT ACTION BUTTONS --- */}
      <div className="flex flex-col gap-2 relative z-10">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={action.onClick}
            className="group relative w-full flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:bg-white hover:border-[#2FA4A9] transition-all duration-200 hover:shadow-md hover:shadow-[#2FA4A9]/10 active:scale-[0.98]"
          >
            <div className="flex items-center gap-3 text-left">
              {/* Smaller Icon Box */}
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#2FA4A9] group-hover:text-white group-hover:border-[#2FA4A9] transition-all shadow-sm">
                {action.icon ? React.cloneElement(action.icon, { size: 14 }) : <Zap size={14} />}
              </div>
              
              <div>
                <span className="block text-[9px] font-black text-slate-600 uppercase tracking-widest group-hover:text-[#2FA4A9] transition-colors">
                  {action.label}
                </span>
                {action.description && (
                  <span className="block text-[7px] font-bold text-slate-400 uppercase mt-0.5 group-hover:text-slate-500 transition-colors">
                    {action.description}
                  </span>
                )}
              </div>
            </div>

            {/* Subtle Indicator */}
            <ChevronRight size={12} className="text-slate-300 group-hover:text-[#2FA4A9] transition-colors" />
          </button>
        ))}
      </div>

      {/* --- SYSTEM PULSE FOOTER --- */}
      <div className="mt-6 pt-5 border-t border-slate-50 flex justify-center relative z-10">
        <div className="px-4 py-1.5 bg-slate-50/50 rounded-full flex items-center gap-2 border border-slate-100">
          <div className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </div>
          <span className="text-[8px] font-[1000] text-slate-400 uppercase tracking-[0.15em]">
            Admin Protocol Active
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuickActionPanel;