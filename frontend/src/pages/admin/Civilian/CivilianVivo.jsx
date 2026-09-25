import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, User, Phone, Mail, Shield, AlertTriangle, CheckCircle, Clock, History, Calendar, FileText } from "lucide-react";
import { fetchCivilianVivo } from "../../../api/civilianAdminApi";

export default function CivilianVivo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, [id]);

    async function loadData() {
        setLoading(true);
        try {
            const vivoData = await fetchCivilianVivo(id);
            setData(vivoData);
        } catch (err) {
            setError("Failed to load VIVO details.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="p-10 text-center text-slate-500">Loading VIVO details...</div>;
    if (error || !data) return <div className="p-10 text-center text-red-500">{error || "Civilian not found"}</div>;

    const isPermBanned = data.accountStatus === 'PERMANENT_BANNED';

    return (
        <div className="space-y-6 font-['Inter'] max-w-6xl mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Civilian Details (View Only)</h1>
                    <p className="text-slate-400 text-sm">Read-only view for banned/restricted accounts</p>
                </div>
            </div>

            {/* Basic Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <User className="text-[#2FA4A9]" size={20} />
                    Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Civilian ID</p>
                        <p className="text-sm font-medium text-slate-700">CIV-{data.civilianId}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Full Name</p>
                        <p className="text-sm font-medium text-slate-700">{data.maskedName || "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Email</p>
                        <p className="text-sm font-medium text-slate-700">{data.maskedEmail || "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Phone</p>
                        <p className="text-sm font-medium text-slate-700">{data.maskedPhone || "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Status</p>
                        <div className="mt-1">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase border
                                ${isPermBanned ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-100 text-slate-600 border-slate-200'}
                             `}>
                                {isPermBanned ? <AlertTriangle size={12} /> : <Shield size={12} />}
                                {data.accountStatus?.replace('_', ' ')}
                            </span>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Reason for Ban</p>
                        <p className="text-sm font-medium text-slate-700">{data.banReason || "No reason provided"}</p>
                    </div>
                </div>
            </div>

            {/* Reservation History */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <History className="text-[#2FA4A9]" size={20} />
                    Reservation History
                </h3>
                <p className="text-xs text-slate-400 mb-6">Reservation records are read-only here. Admin can view only.</p>

                <div className="space-y-3">
                    {data.reservations && data.reservations.length > 0 ? (
                        data.reservations.map((res) => (
                            <div key={res.reservationId} className="flex items-center gap-2 text-sm text-slate-600 border-b border-slate-50 last:border-0 pb-2 last:pb-0">
                                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                <span className="font-bold">Reservation #{res.reservationId}</span>
                                <span className="text-slate-400">-</span>
                                <span className={`font-medium ${getStatusColor(res.status)}`}>{res.status}</span>
                                <span className="text-slate-400">-</span>
                                <span>{new Date(res.reservationDate).toLocaleDateString()}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-slate-400 italic">No reservation history found.</p>
                    )}
                </div>
            </div>

            {/* Appeal History */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <FileText className="text-[#2FA4A9]" size={20} />
                    Appeal History
                </h3>
                <p className="text-xs text-slate-400 mb-6">No appeal submitted or appeal period expired.</p>

                <div className="space-y-3">
                    {data.appeals && data.appeals.length > 0 ? (
                        data.appeals.map((appeal) => (
                            <div key={appeal.appealId} className="flex items-center gap-2 text-sm text-slate-600 border-b border-slate-50 last:border-0 pb-2 last:pb-0">
                                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                <span className="font-bold">Appeal #{appeal.appealNumber}</span>
                                <span className="text-slate-400">-</span>
                                <span className={`font-medium ${getAppealStatusColor(appeal.status)}`}>{appeal.status}</span>
                                <span className="text-slate-400">-</span>
                                <span>{new Date(appeal.createdAt).toLocaleDateString()}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-slate-400 italic">No appeal history.</p>
                    )}
                </div>
            </div>

        </div>
    );
}

function getStatusColor(status) {
    if (status === 'COLLECTED') return 'text-emerald-600';
    if (status === 'UNCOLLECTED' || status === 'CANCELLED') return 'text-rose-600';
    return 'text-slate-600';
}

function getAppealStatusColor(status) {
    if (status === 'APPROVED') return 'text-emerald-600';
    if (status === 'REJECTED') return 'text-rose-600';
    return 'text-orange-600';
}
