import React from 'react';

const MetricCard = ({ label, value, borderColor }) => {
  return (
    <div 
      className={`bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between h-[120px] transition-transform hover:scale-[1.02] cursor-pointer`}
      style={{ borderTop: `4px solid ${borderColor}` }}
    >
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        {label}
      </span>
      <span className="text-3xl font-extrabold text-slate-900">
        {value}
      </span>
    </div>
  );
};

export default MetricCard;