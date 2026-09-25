import React, { useState } from "react";
import { X, AlertCircle, CheckCircle2, MailWarning } from "lucide-react";
import { updateReportStatus } from "../../../Service/Admin/ReportService";

const RejectReportModal = ({ open, report, onClose, refresh }) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open || !report) return null;

  const handleReject = async () => {
    if (!reason.trim()) return alert("A rejection reason is mandatory.");
    setLoading(true);
    try {
      await updateReportStatus(report.id, "REJECTED", reason);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setReason("");
        onClose();
        if (refresh) refresh();
      }, 2300);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Failed to reject report.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center z-[1000] p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl border border-white overflow-hidden animate-in zoom-in duration-300">
        {!showSuccess ? (
          <>
            <div className="bg-rose-50 px-10 py-8 flex items-center justify-between border-b border-rose-100/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-rose-500 rounded-2xl text-white shadow-lg shadow-rose-200"><AlertCircle size={24} /></div>
                <div>
                  <h2 className="text-2xl font-[1000] text-rose-950 uppercase tracking-tighter">Reject</h2>
                  <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mt-1">Invalid Submission</p>
                </div>
              </div>
              <button onClick={onClose} className="text-rose-300 hover:text-rose-500 bg-white p-2 rounded-full shadow-sm"><X size={20} /></button>
            </div>

            <div className="p-10">
              <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <MailWarning size={14} className="text-rose-600" /> Mandatory Rejection Reason
              </label>
              <textarea
                className="w-full h-32 p-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-8 focus:ring-rose-500/5 focus:border-rose-500 outline-none text-sm font-bold text-slate-700 placeholder:text-slate-300 resize-none"
                placeholder="Explain why this inquiry/report is being rejected..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <div className="px-10 pb-10 flex flex-col gap-3">
              <button onClick={handleReject} disabled={loading} className="w-full py-5 rounded-2xl bg-rose-600 text-white font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-rose-100 hover:scale-[1.02] active:scale-95 transition-all">
                {loading ? "Updating..." : "Confirm Rejection"}
              </button>
            </div>
          </>
        ) : (
          <div className="p-16 text-center animate-in fade-in zoom-in duration-500">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-rose-400 rounded-full animate-ping opacity-20"></div>
              <div className="relative w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center border-4 border-white shadow-xl"><CheckCircle2 size={56} /></div>
            </div>
            <h2 className="text-3xl font-[1000] text-slate-800 uppercase tracking-tighter mb-2">Report Rejected</h2>
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-200">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> Email Dispatched
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RejectReportModal;