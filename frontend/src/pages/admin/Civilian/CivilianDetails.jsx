import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, User, Phone, Mail, Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { fetchCivilianDetails, tempBanCivilian, permanentBanCivilian } from "../../../api/civilianAdminApi";

export default function CivilianDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [civilian, setCivilian] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Ban Modal State
    const [showBanModal, setShowBanModal] = useState(false);
    const [banType, setBanType] = useState(""); // 'TEMP' or 'PERMANENT'
    const [banReason, setBanReason] = useState("");
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadDetails();
    }, [id]);

    async function loadDetails() {
        setLoading(true);
        try {
            const data = await fetchCivilianDetails(id);
            setCivilian(data);
        } catch (err) {
            setError("Failed to load civilian details.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleBanSubmit() {
        if (!banReason.trim()) return;
        setProcessing(true);
        try {
            // TODO: Get actual logged-in admin ID. Assuming 1 for now or from localStorage if available.
            const adminId = localStorage.getItem("adminId") || 1;

            if (banType === 'TEMP') {
                await tempBanCivilian(id, banReason, adminId);
            } else {
                await permanentBanCivilian(id, banReason, adminId);
            }
            setShowBanModal(false);
            setBanReason("");
            loadDetails(); // Refresh data
        } catch (err) {
            alert("Failed to perform action: " + err.message);
        } finally {
            setProcessing(false);
        }
    }

    if (loading) return <div className="p-10 text-center text-slate-500">Loading details...</div>;
    if (error || !civilian) return <div className="p-10 text-center text-red-500">{error || "Civilian not found"}</div>;

    return (
        <div className="space-y-6 font-['Inter'] max-w-5xl mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Civilian Account Details</h1>
                    <p className="text-slate-400 text-sm">Review civilian account status and history</p>
                </div>
            </div>

            {/* Main Grid */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-8">

                {/* 1. Account Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Civilian ID</p>
                        <p className="text-lg text-slate-800 font-bold">CIV-{civilian.id}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Full Name</p>
                        <p className="text-lg text-slate-800 font-bold">{civilian.fullName}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Email</p>
                        <p className="text-base text-slate-800 font-medium">{civilian.email}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Contact Number</p>
                        <p className="text-base text-slate-800 font-medium">{civilian.phone}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Account Status</p>
                        <div className="mt-1"><StatusBadge status={civilian.accountStatus} /></div>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Temporary Ban Count</p>
                        <p className="text-base text-slate-800 font-medium">{civilian.tempBanCount}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Appeal Count</p>
                        <p className="text-base text-slate-800 font-medium">{civilian.appealCount}</p>
                    </div>
                </div>

                <hr className="border-slate-100" />

                {/* 2. Ban Information (Conditional) */}
                {(civilian.accountStatus === 'TEMP_BANNED' || civilian.accountStatus === 'PERMANENT_BANNED') && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-orange-600">Ban Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Ban Reason</p>
                                <p className="text-base text-slate-800 font-medium">{civilian.banReason || "No reason provided"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Ban Date</p>
                                <p className="text-base text-slate-800 font-medium">
                                    {civilian.banDate ? new Date(civilian.banDate).toISOString().split('T')[0] : '-'}
                                </p>
                            </div>

                            {civilian.accountStatus === 'TEMP_BANNED' && (
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Appeal Deadline</p>
                                    <p className={`text-base font-bold ${civilian.remainingDays <= 3 ? 'text-red-600' : 'text-orange-600'}`}>
                                        {civilian.remainingDays} days remaining
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Warnings */}
                        <div className="space-y-2">
                            {civilian.tempBanCount >= 2 && (
                                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm font-bold">
                                    <AlertTriangle size={16} />
                                    Warning: Maximum temporary bans reached. Next ban will be permanent.
                                </div>
                            )}
                            {civilian.appealCount >= 2 && (
                                <div className="flex items-center gap-2 text-orange-600 bg-orange-50 p-3 rounded-lg text-sm font-bold">
                                    <AlertTriangle size={16} />
                                    Warning: This is the last allowed appeal for this user.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 3. Action Buttons */}
                <div className="flex gap-4 pt-4">
                    {civilian.accountStatus === 'TEMP_BANNED' && (
                        <button
                            onClick={() => navigate(`/admin/appeals?civilianId=${civilian.id}`)}
                            className="px-5 py-2.5 bg-[#2FA4A9] text-white font-bold rounded-lg hover:bg-[#268e93] transition-colors shadow-sm text-sm"
                        >
                            View Appeal Details
                        </button>
                    )}

                    {civilian.accountStatus === 'PERMANENT_BANNED' && (
                        <button
                            onClick={() => navigate(`/admin/civilians/${civilian.id}/vivo`)}
                            className="px-5 py-2.5 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 transition-colors shadow-sm text-sm"
                        >
                            VIVO Manage
                        </button>
                    )}

                    <button
                        onClick={() => navigate(-1)}
                        className="px-5 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm"
                    >
                        Back
                    </button>

                    {/* Keep Ban Buttons for Active Users (Backend Admin Feature) - Hidden from main view if strictly following request, but useful to keep accessible */}
                    {civilian.accountStatus === 'ACTIVE' && (
                        <div className="ml-auto flex gap-2">
                            <button
                                onClick={() => { setBanType('TEMP'); setShowBanModal(true); }}
                                className="px-4 py-2 border border-orange-200 text-orange-600 font-bold rounded-lg hover:bg-orange-50 text-xs"
                            >
                                Temp Ban
                            </button>
                            <button
                                onClick={() => { setBanType('PERMANENT'); setShowBanModal(true); }}
                                className="px-4 py-2 border border-rose-200 text-rose-600 font-bold rounded-lg hover:bg-rose-50 text-xs"
                            >
                                Perm Ban
                            </button>
                        </div>
                    )}
                </div>

            </div>

            {/* Ban Action Modal */}
            {showBanModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-2">
                            Confirm {banType === 'TEMP' ? 'Temporary' : 'Permanent'} Ban
                        </h3>
                        <p className="text-sm text-slate-500 mb-4">
                            {banType === 'TEMP'
                                ? "This will restrict the user's account for 14 days. They can appeal within this period."
                                : "This action is irreversible. The user will be permanently blocked from accessing the system."}
                        </p>

                        <textarea
                            className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2FA4A9] outline-none min-h-[100px]"
                            placeholder="Enter reason for ban..."
                            value={banReason}
                            onChange={(e) => setBanReason(e.target.value)}
                        />

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowBanModal(false)}
                                className="px-4 py-2 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBanSubmit}
                                disabled={processing || !banReason.trim()}
                                className={`px-6 py-2 rounded-lg text-white font-bold text-sm shadow-sm transition-all
                  ${banType === 'TEMP' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-500 hover:bg-red-600'}
                  ${(processing || !banReason.trim()) ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                            >
                                {processing ? 'Processing...' : 'Confirm Ban'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }) {
    const configs = {
        ACTIVE: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', icon: CheckCircle },
        TEMP_BANNED: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', icon: Clock },
        PERMANENT_BANNED: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', icon: AlertTriangle },
    };
    const { bg, text, border, icon: Icon } = configs[status] || {};

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase border ${bg} ${text} ${border}`}>
            {Icon && <Icon size={12} />}
            {status?.replace('_', ' ')}
        </span>
    );
}
