import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, FileText, MapPin, Phone, Mail, User, ShieldX } from 'lucide-react';
import { adminService } from "../../../services/adminService";

const RejectedPharmacyDetails = () => {
  const navigate = useNavigate();
  // Ensure "id" matches the path in App.jsx: path="/admin/pharmacy/rejected/:id"
  const { id } = useParams(); 
  
  const [pharmacy, setPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchRejectedPharmacy = async () => {
      try {
        const data = await adminService.getRejectedPharmacyById(id);
        if (isMounted) {
          setPharmacy(data);
        }
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        if (isMounted) {
          setPharmacy(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRejectedPharmacy();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) return <div className="p-20 text-center font-black text-slate-300 animate-pulse tracking-[0.3em]">Accessing Audit Log...</div>;

  return (
    <div className="min-h-screen p-8 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-[#2FA4A9] font-black text-[10px] uppercase tracking-widest transition-all">
        <ArrowLeft size={16} /> Back to Archive
      </button>

      <div className="grid grid-cols-12 gap-8">
        {/* LEFT: INFORMATION */}
        <div className="col-span-8 space-y-6">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#2FA4A9]"></div>
            
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-rose-50 rounded-lg text-rose-500"><ShieldX size={18}/></div>
               <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Rejected Application Record</h2>
            </div>
            
            <h1 className="text-3xl font-[1000] text-slate-800 uppercase tracking-tighter mb-10">
              {pharmacy?.pharmacy_name || pharmacy?.name || "Application #"+id}
            </h1>

            <div className="grid grid-cols-2 gap-y-10 gap-x-6">
              <InfoItem icon={<User />} label="Owner / Lead Pharmacist" value={pharmacy?.owner_name || pharmacy?.ownerName || "N/A"} />
              <InfoItem icon={<MapPin />} label="Business Location" value={pharmacy?.address || "N/A"} />
              <InfoItem icon={<Phone />} label="Contact Line" value={pharmacy?.contact || pharmacy?.phone || "N/A"} />
              <InfoItem icon={<Mail />} label="Email Registered" value={pharmacy?.email || "N/A"} />
            </div>
          </div>

          {/* REJECTION REASON SECTION */}
          <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                 <AlertCircle size={20} />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Governance Decision: Rejection Reason</h3>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
               <p className="text-slate-500 font-bold leading-relaxed italic text-sm">
                 "{pharmacy?.rejection_reason || "The submitted documentation did not meet the regulatory standards for pharmacy operation. Specifically, the SLMC registration provided was not verifiable."}"
               </p>
            </div>
          </div>
        </div>

        {/* RIGHT: DOCUMENT ARCHIVE */}
        <div className="col-span-4">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-slate-300">
            <h4 className="text-[10px] font-black text-[#2FA4A9] uppercase tracking-widest mb-8 flex items-center gap-2">
              <FileText size={16} /> Attached Evidence
            </h4>
            <div className="space-y-3">
              {['License_Scan.pdf', 'Premises_Plan.pdf'].map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-[#2FA4A9]/20 transition-all cursor-not-allowed">
                  <span className="text-[10px] font-bold text-slate-300 truncate">{doc}</span>
                  <FileText size={14} className="text-[#2FA4A9]" />
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-dashed border-white/10 text-center">
               <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Read-Only Archive File</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal Helper
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 border border-slate-100">{icon}</div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-xs font-black text-slate-700 tracking-tight">{value}</p>
    </div>
  </div>
);

export default RejectedPharmacyDetails;