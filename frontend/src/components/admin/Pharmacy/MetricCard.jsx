import React from 'react';

const MetricCard = ({ title, count, color = "#2FA4A9", isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden cursor-pointer transition-all duration-500 ease-out
        p-4 rounded-[1.25rem] border-0 flex flex-col justify-end h-24 group
        ${isActive 
          ? 'shadow-[0_20px_50px_-12px_rgba(47,164,169,0.5)] scale-105 z-10' 
          : 'bg-white shadow-[0_12px_30px_-16px_rgba(15,23,42,0.25)] hover:shadow-2xl hover:-translate-y-2'
        }
      `}
      style={{
        background: isActive 
          ? `linear-gradient(135deg, ${color} 0%, #1a7a7e 100%)` 
          : 'linear-gradient(135deg, #f8fbff 0%, #eef7f7 50%, #ffffff 100%)',
      }}
    >
      {/* Animated Glowing Orb in background */}
      <div 
        className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-3xl transition-opacity duration-700
        ${isActive ? 'bg-white/20 opacity-100' : 'opacity-0 group-hover:opacity-30'}`}
        style={{ backgroundColor: !isActive ? color : '' }}
      />

      {/* The Pulse Indicator - Now positioned at the top right */}
      {isActive && (
        <div className="absolute top-6 right-8 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </div>
      )}

      {/* Data Section */}
      <div className="z-10 mb-1">
        <h3 className={`text-3xl font-black transition-colors duration-300 tracking-tighter ${isActive ? 'text-white' : 'text-slate-800'}`}>
          {count?.toLocaleString() || "0"}
        </h3>
        <p className={`text-[10px] font-bold uppercase mt-1 tracking-[0.12em] transition-colors duration-300
          ${isActive ? 'text-teal-50' : 'text-[#2FA4A9]'}`}>
          {title}
        </p>
      </div>

      {/* Bottom Accent Line */}
      <div 
        className={`h-0.5 rounded-full transition-all duration-700 
        ${isActive ? 'bg-white w-full' : 'bg-[#2FA4A9]/30 w-16'}`} 
      />

      {/* Subtle border for inactive state */}
      {!isActive && (
        <div className="absolute inset-0 border border-slate-100 rounded-[2rem] pointer-events-none" />
      )}
    </div>
  );
};

export default MetricCard;