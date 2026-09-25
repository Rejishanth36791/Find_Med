import React, { useState } from "react";
import { X, PauseCircle, AlertCircle, CheckCircle2, MailWarning } from "lucide-react";
import { suspendPharmacy } from "../../../Service/Admin/PharmacyService";

const SuspendPharmacyModal = ({ open, pharmacy, onClose, refresh }) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Guard clause
  if (!open || !pharmacy) return null;

  const handleSuspend = async () => {
    const idToUse = pharmacy.pharmacy_id || pharmacy.id || pharmacy._id;

    if (!idToUse) {
      alert("Error: Pharmacy ID is missing.");
      return;
    }

    if (!reason.trim()) {
      alert("Please provide a suspension reason for the pharmacy owner.");
      return;
    }

    setLoading(true);
    try {
      // 1. BACKEND CALL: Update status to 'SUSPENDED'
      await suspendPharmacy(idToUse, reason);
      
      // 2. TRIGGER EPIC SUCCESS STATE
      setShowSuccess(true);

      // 3. AUTO-CLOSE & REFRESH after animation
      setTimeout(async () => {
        setShowSuccess(false);
        setReason("");
        onClose();
        if (refresh) await refresh();
      }, 2300);
      
    } catch (err) {
      console.error("Suspension failed:", err.message);
      alert(`Failed to suspend: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center z-[1000] p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl border border-white overflow-hidden animate-in zoom-in duration-300">
        
        {!showSuccess ? (
          <>
            {/* --- HEADER --- */}
            <div className="bg-amber-50 px-10 py-8 flex items-center justify-between border-b border-amber-100/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500 rounded-2xl text-white shadow-lg shadow-amber-200">
                  <PauseCircle size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-[1000] text-amber-950 uppercase tracking-tighter leading-none">
                    Suspend
                  </h2>
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mt-1">Temporary Halt</p>
                </div>
              </div>
              <button onClick={onClose} className="text-amber-300 hover:text-amber-500 transition-colors bg-white p-2 rounded-full shadow-sm">
                <X size={20} />
              </button>
            </div>

            {/* --- BODY --- */}
            <div className="p-10">
              <div className="mb-6">
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-2">Pharmacy to be paused</p>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight truncate">
                  {pharmacy.pharmacy_name || pharmacy.name}
                </h3>
              </div>

              <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <MailWarning size={14} className="text-amber-600" />
                Reason for Suspension
              </label>
              <textarea
                className="w-full h-32 p-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 outline-none transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300 resize-none shadow-inner"
                placeholder="Specify the policy violation or reason (e.g., Expired drug reported, incomplete profile)..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              
              <div className="mt-6 p-4 bg-slate-900 rounded-2xl flex items-start gap-3">
                <AlertCircle size={16} className="text-amber-400 mt-0.5 shrink-0" />
                <p className="text-[10px] text-slate-300 font-bold leading-relaxed uppercase tracking-tight">
                  This will immediately hide all stock from the public app until the account is reactivated.
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
                Go Back
              </button>
              
              <button 
                onClick={handleSuspend} 
                disabled={loading}
                className="flex-[2] py-4 rounded-2xl bg-amber-500 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-amber-200 hover:bg-amber-600 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Processing..." : "Confirm Suspension"}
              </button>
            </div>
          </>
        ) : (
          /* --- EPIC SUCCESS STATE --- */
          <div className="p-16 text-center animate-in fade-in zoom-in duration-500">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-amber-400 rounded-full animate-ping opacity-20"></div>
              <div className="relative w-24 h-24 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                <CheckCircle2 size={56} />
              </div>
            </div>
            
            <h2 className="text-3xl font-[1000] text-slate-800 uppercase tracking-tighter mb-2">Account Paused</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-8">Status Updated to Suspended</p>
            
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-amber-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-200">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Suspension Email Dispatched
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuspendPharmacyModal;