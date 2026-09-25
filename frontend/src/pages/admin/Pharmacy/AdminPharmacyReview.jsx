import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Phone, Mail, FileText,
  ShieldCheck, Building2, Send, CheckCircle, AlertCircle
} from 'lucide-react';

/* Action Modals */
import ActivatePharmacyModal from "../../../components/admin/Pharmacy/ActivatePharmacyModal";
import RejectPharmacyModal from "../../../components/admin/Pharmacy/RejectPharmacyModal";

/* Service */
import { getPharmacyDetails } from "../../../Service/admin/pharmacyService";

const AdminPharmacyReview = () => {
  const { pharmacyId } = useParams();
  const navigate = useNavigate();

  // DYNAMIC ROLE: Pulls from your auth storage (ADMIN or SUPER_ADMIN)
  const userRole = localStorage.getItem('userType');

  const [pharmacy, setPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [targetStatus, setTargetStatus] = useState('ACTIVE');

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const data = await getPharmacyDetails(pharmacyId);
      const mapped = {
        pharmacy_id: data?.id ?? data?.pharmacy_id ?? pharmacyId,
        pharmacy_name: data?.name ?? data?.pharmacy_name ?? "Unknown Pharmacy",
        status: data?.status ?? "PENDING",
        location: data?.address ?? data?.location ?? "Not Provided",
        contact: data?.phone ?? data?.contact ?? "Not Provided",
        email: data?.email ?? "Not Provided",
        license_no: data?.licenseNo ?? data?.license_no ?? "Not Provided",
      };
      setPharmacy(mapped);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pharmacyId) fetchDetails();
  }, [pharmacyId]);

  /**
   * NAVIGATION LOGIC AFTER MODAL SUCCESS
   */
  const handleAfterAction = (type) => {
    if (type === 'REJECT') {
      // Move to the rejected pharmacies list (Create this route in App.jsx later)
      navigate('/admin/pharmacy/rejected');
    } else {
      // If approved/forwarded, go back to the main queue
      navigate('/admin/pharmacy-approvals');
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse uppercase tracking-widest text-xs">Fetching Application Details...</div>;
  if (!pharmacy) return <div className="p-20 text-center text-rose-500 font-bold">Application not found.</div>;

  return (
    <div className="flex-1 space-y-6 pb-12 animate-in fade-in duration-500">

      {/* 1. TOP ACTION BAR */}
      <div className="flex items-center justify-between bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-slate-500 hover:text-[#2FA4A9] transition-all font-bold text-sm"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Approval Queue
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => setOpenReject(true)}
            className="px-6 py-2.5 bg-rose-50 text-rose-500 rounded-xl font-black text-[10px] uppercase tracking-widest border border-rose-100 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
          >
            Reject Application
          </button>

          {userRole === "ADMIN" && (
            <button
              onClick={() => {
                setTargetStatus('APPROVED');
                setOpenApprove(true);
              }}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-100 hover:scale-105 transition-all"
            >
              <Send size={14} /> Send to Super Admin
            </button>
          )}

          {userRole === "SUPER_ADMIN" && (
            <button
              onClick={() => {
                setTargetStatus('ACTIVE');
                setOpenApprove(true);
              }}
              className="px-6 py-2.5 bg-[#2FA4A9] text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-[#2FA4A9]/20 hover:scale-105 transition-all"
            >
              <CheckCircle size={14} /> Add to the System
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-8 mb-12 relative">
              <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border border-slate-100 text-slate-400">
                <Building2 size={48} />
              </div>
              <div>
                <h2 className="text-3xl font-[1000] text-slate-800 tracking-tighter uppercase leading-none">
                  {pharmacy.pharmacy_name}
                </h2>
                <div className="flex items-center gap-2 mt-4">
                  <span className="px-3 py-1 bg-amber-100 text-amber-600 font-black text-[9px] uppercase tracking-[0.2em] rounded-full">
                    {pharmacy.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-10 border-t border-slate-50">
              <ReviewDetail icon={<MapPin />} label="Proposed Location" value={pharmacy.location} />
              <ReviewDetail icon={<FileText />} label="Registration / License" value={pharmacy.license_no} />
              <ReviewDetail icon={<Phone />} label="Contact Number" value={pharmacy.contact} />
              <ReviewDetail icon={<Mail />} label="Registered Email" value={pharmacy.email} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-200">
            <p className="text-[10px] font-black text-[#2FA4A9] uppercase tracking-[0.3em] mb-6">Application Status</p>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-3 w-3 rounded-full bg-amber-400 animate-pulse"></div>
              <h4 className="text-2xl font-black uppercase tracking-tight">{pharmacy.status.replace('_', ' ')}</h4>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-start gap-3">
                <AlertCircle size={16} className="text-[#2FA4A9] mt-1 shrink-0" />
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {userRole === "ADMIN"
                    ? "Escalating this will move it to the Super Admin's pending queue."
                    : "Approval will activate the pharmacy and grant system-wide access."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS WITH REDIRECT LOGIC */}
      <ActivatePharmacyModal
        open={openApprove}
        pharmacy={pharmacy}
        onClose={() => setOpenApprove(false)}
        refresh={() => handleAfterAction('APPROVE')}
        targetStatus={targetStatus}
      />

      <RejectPharmacyModal
        open={openReject}
        pharmacy={pharmacy}
        onClose={() => setOpenReject(false)}
        refresh={() => handleAfterAction('REJECT')}
      />
    </div>
  );
};

const ReviewDetail = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="mt-1 p-2 bg-slate-50 rounded-xl text-slate-400">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-bold text-slate-700 leading-tight">{value}</p>
    </div>
  </div>
);

export default AdminPharmacyReview;