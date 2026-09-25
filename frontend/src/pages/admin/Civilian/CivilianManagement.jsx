import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, RefreshCcw, Filter, Eye, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { fetchCivilianMetrics, fetchCivilians } from "../../../api/civilianAdminApi";

import MetricCard from "../../../components/admin/HomeMetricCard";

const MOCK_CIVILIANS = [
  { id: '101', fullName: 'John Doe', email: 'john@example.com', phone: '0771234567', accountStatus: 'TEMP_BANNED', tempBanCount: 3, appealCount: 1, lastActionDate: '2025-12-20T10:00:00Z' },
  { id: '102', fullName: 'Jane Smith', email: 'jane@example.com', phone: '0719876543', accountStatus: 'ACTIVE', tempBanCount: 0, appealCount: 0, lastActionDate: '2025-12-21T14:30:00Z' },
  { id: '103', fullName: 'Kamal Perera', email: 'kamal@example.com', phone: '0765554443', accountStatus: 'PERMANENT_BANNED', tempBanCount: 5, appealCount: 2, lastActionDate: '2025-08-20T09:15:00Z' },
];

export default function CivilianManagement() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({ totalCivilians: 0, activeCivilians: 0, tempBannedCivilians: 0, permanentBannedCivilians: 0 });
  const [rows, setRows] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 0, size: 10, totalPages: 0, totalElements: 0 });
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const THEME_COLOR = "#2FA4A9";

  useEffect(() => {
    loadMetrics();
  }, []);

  useEffect(() => {
    loadTable();
  }, [pageInfo.page, status, search]); // Reload when filters/page change

  async function loadMetrics() {
    try {
      const data = await fetchCivilianMetrics();
      setMetrics(data);
    } catch (e) {
      console.error("Failed to load metrics", e);
    }
  }

  async function loadTable() {
    setLoading(true);
    try {
      const data = await fetchCivilians({
        status: status || null,
        search: search || null,
        page: pageInfo.page,
        size: pageInfo.size
      });
      setRows(data.content);
      setPageInfo({
        page: data.number,
        size: data.size,
        totalPages: data.totalPages,
        totalElements: data.totalElements
      });
    } catch (e) {
      console.error("Failed to load table", e);
    } finally {
      setLoading(false);
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pageInfo.totalPages) {
      setPageInfo(prev => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="space-y-5 font-['Inter'] max-w-full overflow-hidden">
      {/* 1. Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <MetricCard label="Total Civilians" value={metrics.totalCivilians} borderColor={THEME_COLOR} />
        <MetricCard label="Active Civilians" value={metrics.activeCivilians} borderColor="#10b981" />
        <MetricCard label="Temp Banned" value={metrics.tempBannedCivilians} borderColor="#f59e0b" />
        <MetricCard label="Perm Banned" value={metrics.permanentBannedCivilians} borderColor="#ef4444" />
        <div onClick={() => navigate("/admin/civilian-reports")} className="bg-[#FF7A45] rounded-xl p-4 text-white flex flex-col justify-between h-[110px] shadow-sm cursor-pointer hover:brightness-95 transition-all">
          <span className="text-[10px] font-bold uppercase opacity-80">Reports & Inquiries</span>
          <span className="text-xl font-extrabold uppercase">View</span>
        </div>
      </div>

      {/* 2. Filter Bar with Correct Placeholder & Dropdown */}
      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between gap-4">
        <div className="flex flex-1 gap-3 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPageInfo(prev => ({ ...prev, page: 0 })); // Reset page on search
              }}
              placeholder="Search name / email / NIC..."
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#2FA4A9] outline-none text-xs"
            />
          </div>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPageInfo(prev => ({ ...prev, page: 0 })); // Reset page on status change
            }}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-600 outline-none"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="TEMP_BANNED">TEMP_BANNED</option>
            <option value="PERMANENT_BANNED">PERMANENT_BANNED</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={loadTable} className="flex items-center gap-2 px-5 py-2.5 bg-[#2FA4A9] text-white rounded-lg font-bold text-xs hover:bg-[#268e93] transition-all shadow-sm">
            <Filter size={14} /> Apply
          </button>
          <button onClick={() => { setSearch(""); setStatus(""); }} className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-lg border border-slate-200"><RefreshCcw size={16} /></button>
        </div>
      </div>

      {/* 3. The Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Civilian Registry</h2>
          <span className="text-[10px] font-bold text-[#2FA4A9] bg-[#e0f2f1] px-3 py-1 rounded-full uppercase">Records: {pageInfo.totalElements}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[800px]">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 bg-slate-50/30">
                <th className="px-4 py-3 w-16">ID</th>
                <th className="px-4 py-3 w-40">Profile</th>
                <th className="px-4 py-3 w-44">Contact Info</th>
                <th className="px-4 py-3 w-32 text-center">Status</th>
                <th className="px-4 py-3 w-28 text-center">Bans/Appeals</th>
                <th className="px-4 py-3 w-32 text-center">Last Action</th>
                <th className="px-4 py-3 w-36 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-slate-400 text-xs">Loading records...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-slate-400 text-xs">No civilians found.</td></tr>
              ) : rows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-4 font-bold text-slate-400 text-xs">#{r.id}</td>
                  <td className="px-4 py-4 font-bold text-slate-800 text-xs">{r.fullName}</td>
                  <td className="px-4 py-4">
                    <div className="text-xs text-slate-600 font-semibold truncate" title={r.email}>{r.email}</div>
                    <div className="text-[10px] text-slate-400 font-bold">{r.phone}</div>
                    <div className="text-[9px] text-slate-300 font-mono mt-0.5">{r.nicNumber}</div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <StatusBadge status={r.accountStatus} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-3 text-xs font-extrabold text-slate-400">
                      <span className={r.tempBanCount > 0 ? 'text-orange-500' : ''} title="Temp bans">{r.tempBanCount}</span>
                      <span className="opacity-20">|</span>
                      <span className={r.appealCount > 0 ? 'text-blue-500' : ''} title="Appeals">{r.appealCount}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-slate-500 text-[10px] font-medium">
                      <Calendar size={12} className="opacity-40" />
                      {r.lastActionDate ? new Date(r.lastActionDate).toLocaleDateString('en-GB') : '-'}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => navigate(`/admin/civilians/${r.id}`)}
                      className="px-3 py-1.5 border border-slate-200 text-[#2FA4A9] text-[10px] font-extrabold uppercase rounded-lg hover:bg-[#2FA4A9] hover:text-white transition-all shadow-sm"
                    >
                      View-Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50/10 border-t border-slate-50 flex justify-between items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Page {pageInfo.page + 1} of {pageInfo.totalPages || 1}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(pageInfo.page - 1)}
              disabled={pageInfo.page === 0}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:text-[#2FA4A9] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => handlePageChange(pageInfo.page + 1)}
              disabled={pageInfo.page >= pageInfo.totalPages - 1}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:text-[#2FA4A9] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const configs = {
    ACTIVE: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
    TEMP_BANNED: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100' },
    PERMANENT_BANNED: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100' },
  };
  const { bg, text, border } = configs[status] || {};
  return (
    <span className={`inline-block px-2 py-1 rounded-md text-[9px] font-extrabold uppercase border ${bg} ${text} ${border}`}>
      {status.replace('_', ' ')}
    </span>
  );
}