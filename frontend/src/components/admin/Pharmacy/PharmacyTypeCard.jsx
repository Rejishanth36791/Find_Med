import React from 'react';

const TYPE_COLORS = [
  '#E6F7F7',
  '#EAF6FF',
  '#F1F7FF',
  '#F3F6FF',
  '#F6F8FF',
  '#EAFBF6',
  '#F0FDFB',
  '#F5FAFF',
  '#EAF4F4',
];

const PharmacyTypeCard = ({ type, count, isActive, onClick }) => {
  const colorIndex = Math.abs((type || '').length) % TYPE_COLORS.length;
  const baseColor = TYPE_COLORS[colorIndex];
  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer transition-all duration-400 ease-out
        p-2 rounded-full border-y border-r flex flex-col justify-center items-center h-12 text-center group
        ${isActive 
          ? 'bg-[#2FA4A9]/5 border-l-[6px] border-[#2FA4A9] shadow-md -translate-y-1' 
          : 'border-slate-100 border-l-[6px] border-slate-200 hover:border-l-[#2FA4A9]/50 hover:shadow-sm'
        }
      `}
      style={!isActive ? { backgroundColor: baseColor } : undefined}
    >
      {/* Background ID Watermark (Optional: Just for "Epic" feel) */}
      <div className={`absolute right-2 top-2 text-[10px] font-black opacity-[0.05] transition-opacity ${isActive ? 'opacity-20' : ''}`}>
        TYPE_{type.substring(0, 3).toUpperCase()}
      </div>

      <div className="z-10">
        <h4 className={`text-[10px] font-black leading-tight transition-colors duration-300 uppercase tracking-tight
          ${isActive ? 'text-[#2FA4A9]' : 'text-slate-600'}`}>
          {type}
        </h4>
      </div>

      <div className="z-10 flex items-baseline space-x-1">
        <span className={`text-base font-black tracking-tighter transition-colors duration-300
          ${isActive ? 'text-[#2FA4A9]' : 'text-slate-800'}`}>
          {count?.toLocaleString() || "0"}
        </span>
        <span className={`text-[8px] font-bold uppercase tracking-widest ${isActive ? 'text-[#2FA4A9]/60' : 'text-slate-400'}`}>
          Units
        </span>
      </div>

      {/* Modern Logic Indicator */}
      {isActive && (
        <div className="absolute bottom-1 right-2">
          <div className="flex items-center space-x-0.5">
             <div className="w-0.5 h-0.5 rounded-full bg-[#2FA4A9] animate-bounce"></div>
             <div className="w-0.5 h-0.5 rounded-full bg-[#2FA4A9] animate-bounce [animation-delay:-0.15s]"></div>
             <div className="w-0.5 h-0.5 rounded-full bg-[#2FA4A9] animate-bounce [animation-delay:-0.3s]"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyTypeCard;