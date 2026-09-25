import React, { useState } from "react";
import { X, AlertCircle, CheckCircle2, MailQuestion, SendHorizontal } from "lucide-react";
import { rejectPharmacy } from "../../../Service/admin/pharmacyService";

const RejectPharmacyModal = ({ open, pharmacy, onClose, refresh }) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Guard: Don't render if closed or data missing
  if (!open || !pharmacy) return null;

  const handleReject = async () => {
    // Basic validation
    if (!reason.trim()) {
      alert("Please provide a reason. This will be simulated as being sent to the pharmacy owner.");
      return;
    }

    const idToUse = pharmacy.pharmacy_id || pharmacy.id;

    setLoading(true);
    try {
      // 1. Backend Call: Updates status to 'REJECTED' in DB
      await rejectPharmacy(idToUse, reason);

      // 2. Trigger the "Epic" Success Animation
      setShowSuccess(true);

      // 3. Delay the redirect so the admin can see the success state
      setTimeout(async () => {
        setShowSuccess(false);
        setReason("");
        onClose();
        if (refresh) await refresh(); // This will trigger the navigation in ReviewPage
      }, 2300);

    } catch (err) {
      console.error("Rejection failed:", err);
      alert("System failed to update pharmacy status. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center z-[1000] p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl border border-white overflow-hidden animate-in zoom-in duration-300">

        {!showSuccess ? (
          <>
            {/* --- HEADER --- */}
            <div className="bg-rose-50 px-10 py-8 flex items-center justify-between border-b border-rose-100/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-rose-500 rounded-2xl text-white shadow-lg shadow-rose-200">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-[1000] text-rose-950 uppercase tracking-tighter leading-none">
                    Reject
                  </h2>
                  <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mt-1">Application Review</p>
                </div>
              </div>
              <button onClick={onClose} className="text-rose-300 hover:text-rose-500 transition-colors bg-white p-2 rounded-full shadow-sm">
                <X size={20} />
              </button>
            </div>

            {/* --- BODY --- */}
            <div className="p-10">
              <div className="mb-8">
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-2">Pharmacy under review</p>
                <h3 className="text-xl font-black text-slate-800 leading-none truncate uppercase tracking-tight">
                  {pharmacy.pharmacy_name || pharmacy.name}
                </h3>
              </div>

              <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <MailQuestion size={14} className="text-rose-500" />
                Reason for Rejection
              </label>
              <textarea
                className="w-full h-36 p-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-8 focus:ring-rose-500/5 focus:border-rose-500 outline-none transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300 resize-none shadow-inner"
                placeholder="e.g. Provided license document is blurred. Please re-upload NMRA certification..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />

              <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                <SendHorizontal size={16} className="text-amber-500 mt-0.5" />
                <p className="text-[10px] text-amber-700 font-bold leading-relaxed uppercase tracking-tight">
                  Proceeding will move this to <span className="underline">Rejected Pharmacies</span> and simulate an email dispatch to the owner.
                </p>
              </div>
            </div>

            {/* --- ACTIONS --- */}
            <div className="px-10 pb-10 flex items-center gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl font-black text-slate-400 text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                disabled={loading}
              >
                Cancel
              </button>

              <button
                onClick={handleReject}
                disabled={loading}
                className="flex-[2] py-4 rounded-2xl bg-slate-900 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-rose-600 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Processing..." : "Confirm Rejection"}
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

            <h2 className="text-3xl font-[1000] text-slate-800 uppercase tracking-tighter mb-2">Application Rejected</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-8">Database Updated</p>

            <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Rejection Email Dispatched
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RejectPharmacyModal;