import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, FileText, Download, CheckCircle, Ban, AlertTriangle } from "lucide-react";
import { fetchAppealDetails, approveAppeal, rejectAppeal } from "../../../api/civilianAdminApi"; // Need to create these API functions

export default function AppealDetails() {
    // We can get ID from params or query string depending on how it's linked
    // The previous screen linked to `/admin/appeals?civilianId=...` but usually appeals have their own ID.
    // Let's assume we might pass appealId via query or we list appeals for a civilian.
    // However, the design shows a specific "Appeal Review" page for ONE appeal.
    // So likely the route should be `/admin/appeals/:id` or we filter by civilian and pick the latest?
    // Given the previous code `navigate(/admin/appeals?civilianId=${civilian.id})`, it implies listing appeals or finding the active one.
    // But the design shows specific Appeal ID #APP-88421.
    // Let's implement looking up the latest appeal for the civilian if no appealId is provided, or better, change the link to pass appealId.
    // For now, let's assume we can get appealId. If `civilianId` is passed, we might need an endpoint to "get active appeal for civilian".
    // Or we update CivilianDetails to fetch appealId first.
    // Let's support `?appealId=` or `?civilianId=` (and fetch latest).

    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const civilianId = searchParams.get("civilianId");
    // Prioritize route param ID, then query param ID
    const appealIdParam = id || searchParams.get("id");

    console.log("AppealDetails mounted. civilianId:", civilianId, "appealIdParam:", appealIdParam);

    // WAIT: The design shows "Appeal ID #APP-88421".
    // I should probably update `CivilianDetails` to pass the appeal ID if possible, or fetch it here.
    // Let's assume we fetch details by civilianId first to find the appeal, OR we just implementation `getAppealByCivilianId` backend endpoint.
    // Actually `CivilianDetails` has `civilian.appealCount`.

    // To be robust:
    // 1. If `id` param exists, fetch that appeal.
    // 2. If `civilianId` param exists, fetch the LATEST pending/resolved appeal for that civilian.

    const [appeal, setAppeal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [processing, setProcessing] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, [civilianId, appealIdParam]);


    async function loadData() {
        setLoading(true);
        try {
            const data = await fetchAppealDetails(civilianId ? { civilianId } : { appealId: appealIdParam });
            setAppeal(data);
        } catch (err) {
            console.error(err);
            if (err.response && (err.response.status === 400 || err.response.status === 404)) {
                setError("No appeals found for this civilian.");
            } else {
                setError("Failed to load appeal details.");
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleApprove() {
        if (!window.confirm("Are you sure you want to activate this account?")) return;
        setProcessing(true);
        try {
            // Admin ID hardcoded/from storage
            const adminId = localStorage.getItem("adminId") || 1;
            await approveAppeal(appeal.appealId, adminId);
            alert("Appeal approved. Account activated.");
            navigate(-1);
        } catch (err) {
            alert("Failed to approve: " + err.message);
        } finally {
            setProcessing(false);
        }
    }

    async function handleReject() {
        if (!rejectReason.trim()) return;
        setProcessing(true);
        try {

            const adminId = localStorage.getItem("adminId") || 1;
            await rejectAppeal(appeal.appealId, rejectReason, adminId);
            alert("Appeal rejected. Account permanently banned.");
            setShowRejectModal(false);
            navigate(-1);
        } catch (err) {
            alert("Failed to reject: " + err.message);
        } finally {
            setProcessing(false);
        }
    }

    if (loading) return <div className="p-10 text-center text-slate-500">Loading appeal details...</div>;
    if (error || !appeal) return <div className="p-10 text-center text-red-500">{error || "Appeal not found"}</div>;

    const isFinalAppeal = appeal.remainingAppeals === 0;

    return (
        <div className="space-y-6 font-['Inter'] max-w-5xl mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Appeal Review</h1>
                    <p className="text-slate-400 text-sm">Evaluate civilian appeal request</p>
                </div>
            </div>

            {/* Warning Banner */}
            {isFinalAppeal && (
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg flex items-center gap-3">
                    <AlertTriangle className="text-amber-600" size={24} />
                    <p className="text-amber-800 font-bold text-sm">
                        Attention: This is the user's final allowed appeal (Remaining Appeals: 0).
                    </p>
                </div>
            )}

            {/* Main Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-8">

                {/* Appeal Info Header */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Appeal ID</p>
                        <p className="text-lg text-slate-800 font-bold">#APP-{appeal.appealId}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Appeal Number</p>
                        <p className="text-lg text-slate-800 font-bold">
                            {appeal.appealCount}{getOrdinal(appeal.appealCount)} Appeal
                            {isFinalAppeal && <span className="text-amber-600 ml-2">(Final)</span>}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Submission Date</p>
                        <p className="text-lg text-slate-800 font-bold">
                            {new Date(appeal.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                    </div>
                </div>

                {/* Appeal Message */}
                <div>
                    <p className="text-xs text-slate-400 font-bold uppercase mb-2">Appeal Message</p>
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-slate-700 leading-relaxed text-sm">
                        {appeal.appealReason}
                    </div>
                </div>

                {/* Attachments */}
                <div>
                    <p className="text-xs text-slate-400 font-bold uppercase mb-2">Attachments</p>
                    <div className="flex flex-wrap gap-4">
                        {appeal.attachment ? (
                            appeal.attachment.split(',').map((att, idx) => (
                                <div key={idx} className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-lg hover:border-[#2FA4A9] transition-colors cursor-pointer group">
                                    <FileText className="text-slate-400 group-hover:text-[#2FA4A9]" size={20} />
                                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 truncate max-w-[150px]">
                                        {att.split('/').pop() || "Attachment " + (idx + 1)}
                                    </span>
                                    <Download className="text-slate-300 group-hover:text-[#2FA4A9]" size={16} />
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-400 italic">No attachments provided.</p>
                        )}
                    </div>
                </div>

            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                    label="Total Reservations"
                    value={appeal.totalReservations || 0}
                    color="text-[#2FA4A9]"
                    subcolor="text-emerald-600"
                />
                <MetricCard
                    label="Uncollected Orders"
                    value={appeal.uncollectedOrders || 0}
                    color="text-orange-500"
                    subcolor="text-orange-600"
                />
                <MetricCard
                    label="Temporary Ban Count"
                    value={appeal.tempBanCount || 0}
                    color="text-rose-500"
                    subcolor="text-rose-600"
                />
                <MetricCard
                    label="Remaining Appeals"
                    value={appeal.remainingAppeals || 0}
                    color="text-slate-600"
                    subcolor="text-slate-800"
                />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
                <button
                    onClick={handleApprove}
                    disabled={processing}
                    className="flex-1 py-3 bg-[#2FA4A9] text-white font-bold rounded-xl hover:bg-[#268e93] transition-all shadow-sm flex justify-center items-center gap-2"
                >
                    <CheckCircle size={20} />
                    Activate Account
                </button>
                <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={processing}
                    className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-all shadow-sm flex justify-center items-center gap-2"
                >
                    <Ban size={20} />
                    Permanently Ban Account
                </button>
                <button
                    onClick={() => navigate(-1)}
                    className="px-8 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                    Back
                </button>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Confirm Permanent Ban</h3>
                        <p className="text-sm text-slate-500 mb-4">
                            Rejecting this appeal will permanently ban the user. This action cannot be undone.
                        </p>
                        <textarea
                            className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 outline-none min-h-[100px]"
                            placeholder="Reason for rejection..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="px-4 py-2 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={processing || !rejectReason.trim()}
                                className="px-6 py-2 bg-rose-600 text-white font-bold rounded-lg text-sm hover:bg-rose-700 disabled:opacity-50"
                            >
                                {processing ? 'Processing...' : 'Confirm Rejection'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

function MetricCard({ label, value, color, subcolor }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
            <p className={`text-3xl font-bold mb-1 ${color}`}>{value}</p>
            <p className="text-xs text-slate-400 uppercase font-bold">{label}</p>
        </div>
    );
}

function getOrdinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
}
