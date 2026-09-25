import React, { useState } from "react";
import { X, CheckCircle2, ShieldCheck, Zap, SendHorizontal } from "lucide-react";
import { activatePharmacy, approvePharmacy } from "../../../Service/admin/pharmacyService";

const ActivatePharmacyModal = ({ open, pharmacy, onClose, refresh, targetStatus = "ACTIVE" }) => {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open || !pharmacy) return null;

  const handleActivate = async () => {
    const idToUse = pharmacy.pharmacy_id || pharmacy.id;
    setLoading(true);

    try {
      // 1. Backend Call: Updates status based on targetStatus
      if (targetStatus === 'APPROVED') {
        await approvePharmacy(idToUse);
      } else {
        await activatePharmacy(idToUse);
      }

      // 2. Trigger the "Epic" Success Animation
      setShowSuccess(true);

      // 3. Auto-redirect after the user sees the success state
      setTimeout(async () => {
        setShowSuccess(false);
        onClose();
        if (refresh) await refresh();
      }, 2300);

    } catch (err) {
      console.error("Activation failed:", err);
      alert("System failed to update status. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center z-[1000] p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl border border-white overflow-hidden animate-in zoom-in duration-300">

        {!showSuccess ? (
          <>
            {/* --- HEADER --- */}
            <div className="bg-indigo-50 px-10 py-8 flex items-center justify-between border-b border-indigo-100/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-[1000] text-indigo-950 uppercase tracking-tighter leading-none">
                    {targetStatus === 'APPROVED' ? "Send to Super Admin" : "Final Approval"}
                  </h2>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">
                    {targetStatus === 'APPROVED' ? "Escalation Process" : "Quality Assurance"}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="text-indigo-300 hover:text-indigo-500 transition-colors bg-white p-2 rounded-full shadow-sm">
                <X size={20} />
              </button>
            </div>

            {/* --- BODY --- */}
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-slate-100 text-indigo-500 shadow-inner">
                <Zap size={36} fill="currentColor" />
              </div>

              <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-2">Final verification for</p>
              <h3 className="text-2xl font-[1000] text-slate-800 leading-none uppercase tracking-tight mb-4">
                {pharmacy.pharmacy_name || pharmacy.name}
              </h3>

              <div className="mt-8 p-5 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-start gap-3 text-left">
                <div className="mt-1 p-1 bg-indigo-100 rounded-md">
                  <SendHorizontal size={14} className="text-indigo-600" />
                </div>
                <p className="text-[11px] text-slate-500 font-bold leading-relaxed uppercase tracking-tight">
                  By proceeding, this pharmacy will be {targetStatus === 'APPROVED' ? <span className="text-indigo-600">moved to the Super Admin queue</span> : <span className="text-indigo-600">published to the platform</span>} and notified.
                </p>
              </div>
            </div>

            {/* --- ACTIONS --- */}
            <div className="px-10 pb-10 flex flex-col gap-3">
              <button
                onClick={handleActivate}
                disabled={loading}
                className="w-full py-5 rounded-2xl bg-[#2FA4A9] text-white font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-[#2FA4A9]/20 hover:bg-[#288e92] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Processing..." : (targetStatus === 'APPROVED' ? "Confirm & Send" : "Confirm & Activate")}
              </button>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl font-black text-slate-300 text-[10px] uppercase tracking-widest hover:text-slate-500 transition-all"
                disabled={loading}
              >
                Cancel Review
              </button>
            </div>
          </>
        ) : (
          /* --- EPIC SUCCESS STATE --- */
          <div className="p-16 text-center animate-in fade-in zoom-in duration-500">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
              <div className="relative w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                <CheckCircle2 size={56} />
              </div>
            </div>

            <h2 className="text-3xl font-[1000] text-slate-800 uppercase tracking-tighter mb-2">
              {targetStatus === 'APPROVED' ? "Sent to Super Admin" : "System Updated"}
            </h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-8">
              {targetStatus === 'APPROVED' ? "Application Escalated" : "Pharmacy is now live"}
            </p>

            <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Welcome Email Dispatched
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivatePharmacyModal;