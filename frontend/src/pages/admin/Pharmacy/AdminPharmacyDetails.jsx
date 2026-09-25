import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Phone, Mail, FileText, 
  ShieldCheck, Building2, Package, 
  CalendarCheck, History, ChevronRight
} from 'lucide-react';

/* Action Modals */
import ActivatePharmacyModal from "../../../components/admin/Pharmacy/ActivatePharmacyModal";
import SuspendPharmacyModal from "../../../components/admin/Pharmacy/SuspendPharmacyModal";
import RemovePharmacyModal from "../../../components/admin/Pharmacy/RemovePharmacyModal";

/* Service */
import { getPharmacyDetails } from "../../../Service/Admin/PharmacyService";

const AdminPharmacyDetails = () => {
  const { pharmacyId } = useParams();
  const navigate = useNavigate();
  
  const [pharmacy, setPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [openActivate, setOpenActivate] = useState(false);
  const [openSuspend, setOpenSuspend] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const data = await getPharmacyDetails(pharmacyId);
      const mapped = {
        pharmacy_id: data?.id ?? data?.pharmacy_id ?? pharmacyId,
        pharmacy_name: data?.name ?? data?.pharmacy_name ?? "Unknown Pharmacy",
        pharmacy_type: data?.pharmacyType ?? data?.pharmacy_type ?? "UNKNOWN",
        status: data?.status ?? "UNKNOWN",
        location: data?.address ?? data?.location ?? "",
        contact: data?.phone ?? data?.contact ?? data?.contact_number ?? "",
        email: data?.email ?? "",
        license_no: data?.licenseNo ?? data?.license_no ?? "",
      };
      setPharmacy(mapped);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [pharmacyId]);

  if (loading) return <div className="p-8 text-center font-bold text-slate-400">Loading Pharmacy Registry...</div>;
  if (!pharmacy) return <div className="p-8 text-center text-rose-500 font-bold">Pharmacy not found.</div>;

  return (
    <div className="flex-1 space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* 1. TOP ACTION BAR */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 text-slate-500 hover:text-[#2FA4A9] transition-all font-bold text-sm shadow-sm"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Registry
        </button>
        
        {pharmacy.status !== "REMOVED" && (
          <div className="flex gap-3">
            <button 
              onClick={() => setOpenRemove(true)}
              className="px-6 py-2 bg-rose-50 text-rose-500 rounded-xl font-black text-[10px] uppercase tracking-widest border border-rose-100 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
            >
              Remove Pharmacy
            </button>

            {pharmacy.status === "ACTIVE" && (
              <button 
                onClick={() => setOpenSuspend(true)}
                className="px-6 py-2 bg-amber-50 text-amber-500 rounded-xl font-black text-[10px] uppercase tracking-widest border border-amber-100 hover:bg-amber-500 hover:text-white transition-all shadow-sm"
              >
                Suspend
              </button>
            )}

            {pharmacy.status === "SUSPENDED" && (
              <button 
                onClick={() => setOpenActivate(true)}
                className="px-6 py-2 bg-[#2FA4A9] text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#2FA4A9]/20 hover:scale-105 transition-all"
              >
                Activate
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Pharmacy Identity Card */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-[#2FA4A9]/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <div className="flex items-center gap-6 mb-10 relative">
              <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center border border-slate-100">
                <Building2 size={48} className="text-[#2FA4A9]" />
              </div>
              <div>
                <h2 className="text-3xl font-[1000] text-slate-800 tracking-tighter uppercase leading-none">
                  {pharmacy.pharmacy_name}
                </h2>
                <div className="flex items-center gap-2 mt-3">
                  <span className="px-3 py-1 bg-[#2FA4A9]/10 text-[#2FA4A9] font-black text-[9px] uppercase tracking-widest rounded-full">
                    {pharmacy.pharmacy_type}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 pt-8 border-t border-slate-50">
              <DetailItem icon={<MapPin size={18} />} label="Address" value={pharmacy.location} />
              <DetailItem icon={<Phone size={18} />} label="Contact" value={pharmacy.contact} />
              <DetailItem icon={<Mail size={18} />} label="Email" value={pharmacy.email} />
              <DetailItem icon={<FileText size={18} />} label="License No" value={pharmacy.license_no} />
            </div>
          </div>

          {/* NEW: INVENTORY & RESERVATION SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LinkedCard 
              icon={<Package />} 
              title="Stock Inventory" 
              description="Manage medicine availability, pricing, and stock alerts." 
              onClick={() => navigate(`/admin/pharmacies/${pharmacyId}/inventory`)}
            />
            <LinkedCard 
              icon={<CalendarCheck />} 
              title="User Reservations" 
              description="View active orders, pickup status, and history." 
              onClick={() => navigate(`/admin/pharmacies/${pharmacyId}/reservations`)}
            />
          </div>
        </div>

        {/* 3. STATUS SIDEBAR */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-200">
            <p className="text-[10px] font-black text-[#2FA4A9] uppercase tracking-[0.3em] mb-4">System Status</p>
            <div className="flex items-center gap-4 mb-6">
              <div className={`h-4 w-4 rounded-full animate-pulse shadow-lg ${
                pharmacy.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-amber-400'
              }`}></div>
              <h4 className="text-2xl font-black uppercase tracking-tight">{pharmacy.status}</h4>
            </div>
            <p className="text-xs font-medium text-slate-400 leading-relaxed">
              Updating this status affects the pharmacy's visibility on the FindMyMeds mobile application.
            </p>
          </div>
        </div>
      </div>

      {/* 4. MODALS */}
      <ActivatePharmacyModal
        open={openActivate}
        pharmacy={pharmacy}
        onClose={() => setOpenActivate(false)}
        refresh={fetchDetails}
        onSuccess={() => setPharmacy((prev) => (prev ? { ...prev, status: "ACTIVE" } : prev))}
      />
      <SuspendPharmacyModal open={openSuspend} pharmacy={pharmacy} onClose={() => setOpenSuspend(false)} refresh={fetchDetails} />
      <RemovePharmacyModal open={openRemove} pharmacy={pharmacy} onClose={() => { setOpenRemove(false); navigate('/admin/pharmacies'); }} />
    </div>
  );
};

/* Sub-components */
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 p-2 bg-slate-50 rounded-xl text-[#2FA4A9]">{icon}</div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
      <p className="text-sm font-bold text-slate-700">{value}</p>
    </div>
  </div>
);

const LinkedCard = ({ icon, title, description, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:border-[#2FA4A9]/40 hover:shadow-md transition-all cursor-pointer group"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-[#2FA4A9] group-hover:text-white transition-all">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <ChevronRight size={18} className="text-slate-300 group-hover:text-[#2FA4A9] transform group-hover:translate-x-1 transition-all" />
    </div>
    <h3 className="text-sm font-[1000] text-slate-800 uppercase tracking-tight mb-2">{title}</h3>
    <p className="text-xs text-slate-400 font-medium leading-relaxed">{description}</p>
  </div>
);

export default AdminPharmacyDetails;