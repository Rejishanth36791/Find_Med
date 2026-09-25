import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileX2, Search, MapPin, Calendar, ChevronRight, ArrowLeft, RefreshCw, ShieldAlert } from 'lucide-react';
import { getPharmacies } from "../../../Service/Admin/PharmacyService";

const RejectedPharmacyTable = () => {
  const navigate = useNavigate();
  const [pharmacies, setPharmacies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const loadRejectedPharmacies = async () => {
    setLoading(true);
    try {
      const response = await getPharmacies("REJECTED");
      const mapped = (response || []).map((pharmacy) => ({
        pharmacy_id: pharmacy?.id ?? pharmacy?.pharmacy_id,
        pharmacy_name: pharmacy?.name ?? pharmacy?.pharmacy_name,
        location: pharmacy?.address ?? pharmacy?.location,
        rejected_date: pharmacy?.rejectedDate ?? pharmacy?.rejected_date ?? pharmacy?.updatedAt ?? pharmacy?.createdAt,
      }));
      setPharmacies(mapped);
    } catch (error) {
      console.error("Failed to load rejected pharmacies", error);
      setPharmacies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRejectedPharmacies();
  }, []);

  const filteredPharmacies = (pharmacies || []).filter(pharmacy => {
    const name = pharmacy?.pharmacy_name || pharmacy?.name || "";
    const id = (pharmacy?.pharmacy_id || pharmacy?.id || "").toString();
    return name.toLowerCase().includes(searchQuery.toLowerCase()) || id.includes(searchQuery);
  });

  return (
    <div className="min-h-screen bg-[#F7FBFB] p-8 space-y-8 animate-in fade-in duration-700">
      
      {/* --- BRANDED HEADER SECTION --- */}
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white p-6 rounded-[2.5rem] border border-[#2FA4A9]/10 shadow-sm relative overflow-hidden">
        {/* Subtle Brand Accent Blur */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#2FA4A9]/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
        
        <div className="flex items-center gap-5 relative z-10">
          <button 
            onClick={() => navigate(-1)} 
            className="p-3 bg-[#F3FBFB] border border-[#2FA4A9]/10 rounded-2xl text-[#2FA4A9]/70 hover:text-[#2FA4A9] hover:bg-[#EAF7F7] hover:border-[#2FA4A9]/30 transition-all group shadow-sm"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#EAF7F7] rounded-2xl text-[#2FA4A9] border border-[#2FA4A9]/10">
                <ShieldAlert size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-[1000] text-slate-800 tracking-tight leading-none">Rejected Archive</h2>
              <p className="text-[10px] font-black text-[#2FA4A9]/80 uppercase tracking-[0.2em] mt-2">Governance & Compliance Control</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2FA4A9]/40" size={16} />
            <input 
              type="text" 
              placeholder="Search registry by name or ID..."
              className="w-full pl-12 pr-5 py-3 bg-[#F3FBFB] border border-[#2FA4A9]/10 rounded-2xl text-xs font-bold text-slate-700 placeholder:text-[#2FA4A9]/40 focus:ring-4 focus:ring-[#2FA4A9]/10 focus:border-[#2FA4A9]/30 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={loadRejectedPharmacies}
            className="p-3 bg-white border border-[#2FA4A9]/10 rounded-2xl text-[#2FA4A9]/70 hover:text-[#2FA4A9] hover:border-[#2FA4A9]/30 transition-all hover:rotate-180 duration-500 shadow-sm"
            title="Refresh Registry"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* --- DATA TABLE SECTION --- */}
      <div className="max-w-7xl mx-auto bg-white rounded-[3rem] border border-[#2FA4A9]/10 shadow-sm overflow-hidden">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#F1F9F9] border-b border-[#E3F2F2]">
              <th className="px-10 py-6 text-[10px] font-black text-[#2FA4A9] uppercase tracking-[0.18em]">Pharmacy Identity</th>
              <th className="px-8 py-6 text-[10px] font-black text-[#2FA4A9] uppercase tracking-[0.18em]">Zone / Location</th>
              <th className="px-8 py-6 text-[10px] font-black text-[#2FA4A9] uppercase tracking-[0.18em] text-center">Rejection Date</th>
              <th className="px-10 py-6 text-right text-[10px] font-black text-[#2FA4A9] uppercase tracking-[0.18em]">Audit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEF6F6]">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-8 py-32 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#2FA4A9]/10 border-t-[#2FA4A9] rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] animate-pulse">Syncing Archive</p>
                  </div>
                </td>
              </tr>
            ) : filteredPharmacies.length > 0 ? (
              filteredPharmacies.map((pharmacy) => (
                <tr 
                  key={pharmacy.pharmacy_id || pharmacy.id} 
                  className="group hover:bg-[#F3FBFB] transition-all duration-300 cursor-pointer odd:bg-white even:bg-[#FBFEFE]" 
                  onClick={() => navigate(`/admin/pharmacy/rejected/${pharmacy.pharmacy_id || pharmacy.id}`)}
                >
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-[#F3FBFB] border border-[#2FA4A9]/10 rounded-2xl flex items-center justify-center text-[#2FA4A9]/60 group-hover:text-[#2FA4A9] group-hover:border-[#2FA4A9]/30 transition-all shadow-sm">
                        <FileX2 size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-[#2FA4A9] transition-colors leading-none">
                          {pharmacy.pharmacy_name || "Unknown Pharmacy"}
                        </p>
                        <p className="text-[10px] font-bold text-[#2FA4A9]/60 mt-2 flex items-center gap-2 tracking-widest">
                            <span className="bg-[#EAF7F7] px-2 py-0.5 rounded text-[8px]">ID: {pharmacy.pharmacy_id || pharmacy.id}</span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2.5 text-slate-600 text-xs font-bold group-hover:translate-x-1 transition-transform">
                      <div className="w-2 h-2 rounded-full bg-[#2FA4A9]/30 group-hover:bg-[#2FA4A9]"></div>
                      <MapPin size={14} className="text-[#2FA4A9]/60" /> 
                      {pharmacy.location || "Location Protected"}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center gap-2 bg-[#FDEFEF] px-4 py-2 rounded-xl text-[#D86A6A] text-[10px] font-black uppercase tracking-widest border border-[#F7D9D9]">
                      <Calendar size={12} /> 
                      {pharmacy.rejected_date || "Registry Date Missing"}
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button className="inline-flex items-center justify-center w-11 h-11 bg-white border border-[#2FA4A9]/10 text-[#2FA4A9]/60 rounded-2xl group-hover:bg-[#2FA4A9] group-hover:text-white group-hover:border-[#2FA4A9] transition-all shadow-sm hover:scale-105 active:scale-95">
                      <ChevronRight size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-8 py-32 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <FileX2 size={48} className="text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">Zero records found in audit log</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- STATUS FOOTER --- */}
      <div className="max-w-7xl mx-auto flex justify-between items-center px-10">
        <p className="text-[9px] font-black text-[#2FA4A9]/40 uppercase tracking-[0.4em]">
          Registry Access Log: {new Date().toLocaleDateString()}
        </p>
        <div className="flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#2FA4A9] animate-pulse"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
        </div>
      </div>
    </div>
  );
};

export default RejectedPharmacyTable;