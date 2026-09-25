import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
/* Icons */
import { Activity, CheckCircle, Clock, AlertTriangle, Search } from "lucide-react";

/* Components */
import MetricCard from "../../../components/admin/Pharmacy/MetricCard";
import NotificationPanel from "../../../components/admin/Pharmacy/NotificationPanel";
import PharmacyTable from "../../../components/admin/Pharmacy/PharmacyTable";
import PharmacyTypeCard from "../../../components/admin/Pharmacy/PharmacyTypeCard";
import QuickActionPanel from "../../../components/admin/Pharmacy/QuickActionPanel";

/* Modals & Services */
import ActivatePharmacyModal from "../../../components/admin/Pharmacy/ActivatePharmacyModal";
import RejectPharmacyModal from "../../../components/admin/Pharmacy/RejectPharmacyModal";
import RemovePharmacyModal from "../../../components/admin/Pharmacy/RemovePharmacyModal";
import SuspendPharmacyModal from "../../../components/admin/Pharmacy/SuspendPharmacyModal";
import { getPharmacies } from "../../../Service/admin/pharmacyService";

const PharmacyManagementHome = () => {
  const navigate = useNavigate();
  /* =======================
        STATE
  ======================= */
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [activeFilter, setActiveFilter] = useState("ACTIVE");
  const [searchTerm, setSearchTerm] = useState("");

  /* Modal States */
  const [openActivate, setOpenActivate] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
  const [openSuspend, setOpenSuspend] = useState(false);

  /* =======================
        EFFECTS
  ======================= */
  useEffect(() => {
    loadPharmacies();

    // TEMP Notifications
    const rawNotifications = [
      { id: 1, message: "Pharmacy verification pending for 'City Meds'", isRead: false, date: new Date() },
      { id: 2, message: "License expiration warning: 'HealthPlus'", isRead: false, date: new Date() },
      { id: 3, message: "New user registration: Admin 'Yash'", isRead: true, date: new Date() },
    ];

    setNotifications(rawNotifications.filter(n => !n.isRead).slice(0, 5));
  }, []);

  /* =======================
        LOAD PHARMACIES
  ======================= */
  const loadPharmacies = async () => {
    setLoading(true);
    try {
      const response = await getPharmacies();
      // MAP backend fields to frontend expected fields
      const mapped = (response || []).map(p => ({
        pharmacy_id: p.id,
        pharmacy_name: p.name,
        pharmacy_type: p.pharmacyType,
        status: p.status,
        address: p.address,
        contact_number: p.phone,
        location: p.address, // for search
      }));
      setPharmacies(mapped);
    } catch (error) {
      console.error("Failed to load pharmacies", error);
    } finally {
      setLoading(false);
    }
  };

  /* =======================
        HANDLERS
  ======================= */
  const handleFilterClick = (filterId) => setActiveFilter(filterId);

  const handleActivate = (p) => { setSelectedPharmacy(p); setOpenActivate(true); };
  const handleReject = (p) => { setSelectedPharmacy(p); setOpenReject(true); };
  const handleRemove = (p) => { setSelectedPharmacy(p); setOpenRemove(true); };
  const handleSuspend = (p) => { setSelectedPharmacy(p); setOpenSuspend(true); };
  const handleView = (id) => {
    const pharmacy = pharmacies.find(p => p.pharmacy_id === id);
    if (pharmacy) setSelectedPharmacy(pharmacy);
  };

  /* =======================
        FILTERED PHARMACIES
  ======================= */
  const filteredPharmacies = pharmacies.filter(p => {
    const matchesSearch = p.pharmacy_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeFilter === "TOTAL"
      ? true
      : (p.status === activeFilter || p.pharmacy_type === activeFilter);
    return matchesSearch && matchesCategory;
  });

  /* Pharmacy types and quick actions */
  const pharmacyTypes = ["RETAIL", "HOSPITAL", "CLINICAL", "COMPOUNDING", "ONLINE", "SPECIALTY", "INDUSTRIAL", "GOVERNMENT", "VETERINARY"];
  const actions = [{ label: "Reports and Inquries", onClick: () => navigate('/admin/reports') }, { label: "Rejected Pharmacies", onClick: () => navigate('/admin/pharmacy/rejected') }];

  return (
    <div className="flex w-full min-h-screen bg-slate-50 font-['Inter']">
      <div className="flex-1 p-8 pt-6 space-y-8 overflow-y-auto">

        {/* Metric Cards */}
        <section className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <MetricCard title="Total" count={pharmacies.length} icon={Activity} isActive={activeFilter === "TOTAL"} onClick={() => handleFilterClick("TOTAL")} />
            <MetricCard title="Active" count={pharmacies.filter(p => p.status === "ACTIVE").length} icon={CheckCircle} color="#10B981" isActive={activeFilter === "ACTIVE"} onClick={() => handleFilterClick("ACTIVE")} />
            <MetricCard title="Pending" count={pharmacies.filter(p => p.status === "PENDING").length} icon={Clock} color="#3B82F6" isActive={activeFilter === "PENDING"} onClick={() => handleFilterClick("PENDING")} />
            <MetricCard title="Suspended" count={pharmacies.filter(p => p.status === "SUSPENDED").length} icon={AlertTriangle} color="#F59E0B" isActive={activeFilter === "SUSPENDED"} onClick={() => handleFilterClick("SUSPENDED")} />
            <MetricCard title="Removed" count={pharmacies.filter(p => p.status === "REMOVED").length} icon={Clock} color="#EF4444" isActive={activeFilter === "REMOVED"} onClick={() => handleFilterClick("REMOVED")} />
          </div>
        </section>

        {/* Pharmacy Type Filters */}
        <section className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pharmacyTypes.map((t) => (
              <PharmacyTypeCard key={t} type={t} count={pharmacies.filter(p => p.pharmacy_type === t).length} isActive={activeFilter === t} onClick={() => handleFilterClick(t)} />
            ))}
          </div>
        </section>

        {/* Search & Table */}
        <div className="pt-6 border-t border-slate-200 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-black text-slate-800 capitalize">{activeFilter.toLowerCase()} Pharmacies</h2>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search pharmacies..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#2FA4A9]/10 focus:border-[#2FA4A9] font-bold text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <PharmacyTable
            pharmacies={filteredPharmacies}
            loading={loading}
            onView={handleView}
            onActivate={handleActivate}
            onReject={handleReject}
            onRemove={handleRemove}
            onSuspend={handleSuspend}
          />
        </div>

        {/* Modals */}
        <ActivatePharmacyModal
          open={openActivate}
          pharmacy={selectedPharmacy}
          onClose={() => setOpenActivate(false)}
          refresh={loadPharmacies}
          onSuccess={(updatedId) => navigate(`/admin/pharmacies/${updatedId}`)}
        />
        <RejectPharmacyModal open={openReject} pharmacy={selectedPharmacy} onClose={() => setOpenReject(false)} refresh={loadPharmacies} />
        <RemovePharmacyModal open={openRemove} pharmacy={selectedPharmacy} onClose={() => setOpenRemove(false)} refresh={loadPharmacies} />
        <SuspendPharmacyModal open={openSuspend} pharmacy={selectedPharmacy} onClose={() => setOpenSuspend(false)} refresh={loadPharmacies} />
      </div>

      {/* Sidebar */}
      <div className="hidden xl:flex flex-col gap-6 w-[220px] ml-auto p-4 bg-white h-screen sticky top-0 overflow-y-auto">
        <QuickActionPanel actions={actions} />
        <NotificationPanel notifications={notifications} />
      </div>
    </div>
  );
};

export default PharmacyManagementHome;
