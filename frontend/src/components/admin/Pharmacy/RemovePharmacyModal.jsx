import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Trash2, AlertTriangle, CheckCircle2, SendHorizontal, MailWarning } from "lucide-react";
import { removePharmacy } from "../../../Service/Admin/PharmacyService";

const RemovePharmacyModal = ({ open, pharmacy, onClose }) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  if (!open || !pharmacy) return null;

  const handleRemove = async () => {
    // 1. DYNAMIC ID DETECTION
    const idToUse = pharmacy.pharmacy_id || pharmacy.id || pharmacy._id;

    if (!idToUse) {
      alert("Error: Pharmacy ID is missing.");
      return;
    }

    if (!reason.trim()) {
      alert("Please enter a reason for removal for our governance records.");
      return;
    }

    setLoading(true);
    try {
      // 2. BACKEND CALL
      await removePharmacy(idToUse, reason);
      
      // 3. TRIGGER EPIC SUCCESS
      setShowSuccess(true);

      // 4. NAVIGATION AFTER DELAY
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        navigate("/admin/pharmacies", { replace: true });
      }, 2300);
      
    } catch (err) {
      console.error("Removal failed:", err.message);
      alert(`Failed to remove: ${err.message}`);
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
                <div className="p-3 bg-rose-600 rounded-2xl text-white shadow-lg shadow-rose-200">
                  <Trash2 size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-[1000] text-rose-950 uppercase tracking-tighter leading-none">
                    Terminate
                  </h2>
                  <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mt-1">Permanent Removal</p>
                </div>
              </div>
              <button onClick={onClose} className="text-rose-300 hover:text-rose-500 transition-colors bg-white p-2 rounded-full shadow-sm">
                <X size={20} />
              </button>
            </div>

            {/* --- BODY --- */}
            <div className="p-10">
              <div className="mb-6 flex items-start gap-3 p-4 bg-rose-50/50 rounded-2xl border border-rose-100">
                <AlertTriangle className="text-rose-500 shrink-0" size={18} />
                <p className="text-[11px] text-rose-800 font-bold leading-relaxed uppercase tracking-tight">
                  Warning: Removing <span className="underline">{pharmacy.pharmacy_name || pharmacy.name}</span> will erase all inventory and reservation history.
                </p>
              </div>

              <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <MailWarning size={14} className="text-rose-600" />
                Reason for Termination
              </label>
              <textarea
                className="w-full h-32 p-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-8 focus:ring-rose-500/5 focus:border-rose-500 outline-none transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300 resize-none shadow-inner"
                placeholder="Specify violation or reason (e.g. Repeated failure to fulfill reservations)..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
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
                onClick={handleRemove} 
                disabled={loading}
                className="flex-[2] py-4 rounded-2xl bg-rose-600 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-rose-200 hover:bg-rose-700 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Wiping Data..." : "Confirm Removal"}
              </button>
            </div>
          </>
        ) : (
          /* --- EPIC SUCCESS STATE --- */
          <div className="p-16 text-center animate-in fade-in zoom-in duration-500">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-rose-400 rounded-full animate-ping opacity-20"></div>
              <div className="relative w-24 h-24 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                <CheckCircle2 size={56} />
              </div>
            </div>
            
            <h2 className="text-3xl font-[1000] text-slate-800 uppercase tracking-tighter mb-2">Record Deleted</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-8">Pharmacy removed from system</p>
            
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-200">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Termination Email Dispatched
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemovePharmacyModal;