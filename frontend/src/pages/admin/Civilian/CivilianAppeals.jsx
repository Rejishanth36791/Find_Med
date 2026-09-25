import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, RefreshCcw, Filter, Eye, ChevronLeft, ChevronRight, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import MetricCard from "../../../components/admin/HomeMetricCard";
import api from "../../../services/api";

export default function CivilianAppeals() {
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState({ totalAppeals: 0, actionsPending: 0, approved: 0, rejected: 0 });
    const [rows, setRows] = useState([]);
    const [pageInfo, setPageInfo] = useState({ page: 0, size: 10, totalPages: 0, totalElements: 0 });
    const [status, setStatus] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadMetrics();
    }, []);

    useEffect(() => {
        loadTable();
    }, [pageInfo.page, status, search]);

    const loadMetrics = async () => {
        // For now using mock or calculation from backend if available. 
        // We will assume backend provides this later or we perform a count.
        // Ideally we'd have an endpoint `/api/admin/appeals/metrics`
        // For now, let's just set placeholders or fetch count if possible.
        try {
            // Placeholder implementation
            setMetrics({ totalAppeals: 0, actionsPending: 0, approved: 0, rejected: 0 });
        } catch (error) {
            console.error("Failed to load metrics", error);
        }
    };

    const loadTable = async () => {
        setLoading(true);
        try {
            // We need to implement this endpoint in Backend
            const response = await api.get('/admin/appeals', {
                params: {
                    page: pageInfo.page,
                    size: pageInfo.size,
                    status: status || null,
                    search: search || null
                }
            });
            const data = response.data;
            setRows(data.content);
            setPageInfo({
                page: data.number,
                size: data.size,
                totalPages: data.totalPages,
                totalElements: data.totalElements
            });
        } catch (e) {
            console.error("Failed to load table", e);
            // Fallback/Mock for testing UI before backend is ready
            // setRows([]); 
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < pageInfo.totalPages) {
            setPageInfo(prev => ({ ...prev, page: newPage }));
        }
    };

    return (
        <div className="space-y-5 font-['Inter'] max-w-full overflow-hidden">

            {/* 1. Header & Metrics - Simplified for now */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard label="Total Appeals" value={pageInfo.totalElements} borderColor="#2FA4A9" />
                {/* Add more metrics if backend supports */}
            </div>

            {/* 2. Filter Bar */}
            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between gap-4">
                <div className="flex flex-1 gap-3 items-center">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPageInfo(prev => ({ ...prev, page: 0 }));
                            }}
                            placeholder="Search Appeal ID / Civilian Name..."
                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#2FA4A9] outline-none text-xs"
                        />
                    </div>
                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            setPageInfo(prev => ({ ...prev, page: 0 }));
                        }}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-600 outline-none"
                    >
                        <option value="">All Statuses</option>
                        <option value="PENDING">PENDING</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="REJECTED">REJECTED</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <button onClick={loadTable} className="flex items-center gap-2 px-5 py-2.5 bg-[#2FA4A9] text-white rounded-lg font-bold text-xs hover:bg-[#268e93] transition-all shadow-sm">
                        <Filter size={14} /> Apply
                    </button>
                    <button onClick={() => { setSearch(""); setStatus(""); }} className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-lg border border-slate-200"><RefreshCcw size={16} /></button>
                </div>
            </div>

            {/* 3. Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">Appeals Registry</h2>
                    <span className="text-[10px] font-bold text-[#2FA4A9] bg-[#e0f2f1] px-3 py-1 rounded-full uppercase">Total: {pageInfo.totalElements}</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse table-fixed min-w-[800px]">
                        <thead>
                            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 bg-slate-50/30">
                                <th className="px-4 py-3 w-20">ID</th>
                                <th className="px-4 py-3 w-40">Civilian</th>
                                <th className="px-4 py-3 w-40">Submission Date</th>
                                <th className="px-4 py-3 w-32 text-center">Status</th>
                                <th className="px-4 py-3 w-40">Reason Snippet</th>
                                <th className="px-4 py-3 w-32 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-slate-400 text-xs">Loading records...</td></tr>
                            ) : rows.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-slate-400 text-xs">No appeals found.</td></tr>
                            ) : rows.map((r) => (
                                <tr key={r.appealId} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-4 font-bold text-slate-400 text-xs">#APP-{r.appealId}</td>
                                    <td className="px-4 py-4">
                                        <div className="font-bold text-slate-800 text-xs">{r.civilianName}</div>
                                        <div className="text-[10px] text-slate-400">ID: {r.civilianId}</div>
                                    </td>
                                    <td className="px-4 py-4 text-xs font-mono text-slate-600">
                                        {new Date(r.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <StatusBadge status={r.status} />
                                    </td>
                                    <td className="px-4 py-4 text-xs text-slate-500 truncate max-w-[150px]" title={r.appealReason}>
                                        {r.appealReason}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <button
                                            onClick={() => navigate(`/admin/appeals/${r.appealId}`)}
                                            className="px-3 py-1.5 border border-slate-200 text-[#2FA4A9] text-[10px] font-extrabold uppercase rounded-lg hover:bg-[#2FA4A9] hover:text-white transition-all shadow-sm"
                                        >
                                            Review
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
        APPROVED: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', icon: CheckCircle },
        PENDING: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', icon: Clock },
        REJECTED: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', icon: AlertTriangle },
    };
    const { bg, text, border, icon: Icon } = configs[status] || { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-100' };

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-extrabold uppercase border ${bg} ${text} ${border}`}>
            {Icon && <Icon size={12} />}
            {status}
        </span>
    );
}
