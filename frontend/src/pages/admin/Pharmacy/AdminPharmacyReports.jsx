import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, Search, Clock, CheckCircle2, 
  AlertCircle, MessageSquare, ChevronRight, RefreshCw
} from 'lucide-react';

// Service Import
import { getAllReports } from "../../../Service/Admin/ReportService";
import MetricCard from "../../../components/admin/Pharmacy/MetricCard";

const AdminPharmacyReports = () => {
  const navigate = useNavigate();
  
  // State Management
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState("");

  // Data Fetching Logic
  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await getAllReports();
      setReports(data || []); 
    } catch (err) {
      console.error("Governance Data Sync Failed:", err);
      setReports([]); // Clear state on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Filter Logic
  const filteredReports = (reports || []).filter(report => {
    const matchesFilter = filter === 'ALL' || report.status === filter;
    const matchesSearch = report.pharmacy_name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Analytics Calculation
  const stats = [
    { label: 'Active Inquiries', count: reports.length, color: '#2FA4A9', key: 'ALL' },
    { label: 'Pending Review', count: reports.filter(r => r.status === 'PENDING').length, color: '#58C6C9', key: 'PENDING' },
    { label: 'Resolved Case', count: reports.filter(r => r.status === 'RESOLVED').length, color: '#2FA4A9', key: 'RESOLVED' },
    { label: 'Rejected Entry', count: reports.filter(r => r.status === 'REJECTED').length, color: '#7AD6D9', key: 'REJECTED' },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 bg-[#F7FBFB] min-h-screen">
      
      {/* --- ANALYTICS DASH --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <MetricCard
            key={stat.key}
            title={stat.label}
            count={stat.count}
            color={stat.color}
            isActive={filter === stat.key}
            onClick={() => setFilter(stat.key)}
          />
        ))}
      </div>

      {/* --- FILTER, SEARCH, REFRESH --- */}
      <div className="flex flex-wrap items-start gap-4">
        <div className="bg-white p-5 rounded-[2rem] border border-[#2FA4A9]/10 shadow-sm flex flex-wrap items-center gap-4 flex-1 min-w-[320px]">
          <div className="flex-1 flex items-center gap-4 min-w-[260px]">
            <Search size={20} className="text-[#2FA4A9]/40" />
            <input 
              type="text" 
              placeholder="Search by Pharmacy Name or Case ID..."
              className="flex-1 bg-transparent border-none text-sm font-semibold text-slate-700 placeholder:text-slate-400 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 bg-[#EAF7F7] p-1.5 rounded-2xl border border-[#2FA4A9]/10">
            {['ALL', 'PENDING', 'RESOLVED', 'REJECTED'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  filter === s ? 'bg-white text-[#2FA4A9] shadow-sm' : 'text-[#2FA4A9]/60 hover:text-[#2FA4A9]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={fetchReports}
          className="h-[56px] w-[56px] flex items-center justify-center bg-white border border-[#2FA4A9]/10 rounded-2xl text-[#2FA4A9] hover:text-[#1E8E92] transition-all hover:rotate-180 duration-500 shadow-sm"
          aria-label="Refresh reports"
          title="Refresh reports"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {/* --- TABLE CONTAINER --- */}
      <div className="bg-white rounded-[3rem] border border-[#2FA4A9]/10 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#F1F9F9] border-b border-[#E3F2F2]">
              <th className="px-8 py-5 text-[11px] font-black text-[#2FA4A9] uppercase tracking-[0.18em]">Inquiry Context</th>
              <th className="px-8 py-5 text-[11px] font-black text-[#2FA4A9] uppercase tracking-[0.18em]">Classification</th>
              <th className="px-8 py-5 text-[11px] font-black text-[#2FA4A9] uppercase tracking-[0.18em]">Current Status</th>
              <th className="px-8 py-5 text-right text-[11px] font-black text-[#2FA4A9] uppercase tracking-[0.18em]">Execution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEF6F6]">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-8 py-24 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-[#2FA4A9]/20 border-t-[#2FA4A9] rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Syncing Records</p>
                  </div>
                </td>
              </tr>
            ) : filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <tr key={report.id} className="group hover:bg-[#F3FBFB] transition-colors odd:bg-white even:bg-[#FBFEFE]">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-[#EAF7F7] border border-[#2FA4A9]/10 rounded-2xl flex items-center justify-center text-[#2FA4A9] group-hover:text-[#1E8E92] group-hover:border-[#2FA4A9]/30 transition-all shadow-sm">
                        <MessageSquare size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 leading-none">{report.pharmacy_name}</p>
                        <p className="text-[11px] font-semibold text-[#2FA4A9]/60 mt-2">#ID-{report.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black text-[#2FA4A9] uppercase tracking-[0.12em] bg-[#EAF7F7] px-3 py-1 rounded-full border border-[#2FA4A9]/10">
                      {report.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <StatusBadge status={report.status} />
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => navigate(`/admin/reports/${report.id}`)}
                      className="inline-flex items-center justify-center w-10 h-10 bg-[#2FA4A9] text-white rounded-xl hover:bg-[#1E8E92] transition-all shadow-lg hover:shadow-[#2FA4A9]/30"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-8 py-24 text-center">
                  <p className="text-slate-400 font-bold italic text-sm">No inquiry records found in the current audit log.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Pure Status UI Component
const StatusBadge = ({ status }) => {
  const styles = {
    PENDING: "bg-[#EAF7F7] text-[#2FA4A9] border-[#CFECEC]",
    RESOLVED: "bg-[#E7FAF9] text-[#1E8E92] border-[#C7EDED]",
    REJECTED: "bg-[#FDEFEF] text-[#D86A6A] border-[#F7D9D9]",
  };

  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.12em] border ${styles[status] || styles.PENDING}`}>
      {status || 'UNASSIGNED'}
    </span>
  );
};

export default AdminPharmacyReports;