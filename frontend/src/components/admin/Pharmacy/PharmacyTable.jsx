import React from "react";
import { useNavigate } from "react-router-dom";

/* =======================
   Helper: days until auto delete
======================= */
const getDaysLeft = (deletedAt) => {
  if (!deletedAt) return null;

  const deletedDate = new Date(deletedAt);
  const expiryDate = new Date(deletedDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);

  const today = new Date();
  const diffTime = expiryDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
};

const PharmacyTable = ({ pharmacies = [], loading }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow rounded-lg overflow-x-auto font-['Inter']">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">ID</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Name</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Type</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Address</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Contact</th>
            <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">Actions</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={7} className="text-center py-6 text-gray-400">
                Loading pharmacies...
              </td>
            </tr>
          ) : pharmacies.length > 0 ? (
            pharmacies.map((pharmacy) => {
              const daysLeft =
                pharmacy.status === "REMOVED"
                  ? getDaysLeft(pharmacy.deletedAt)
                  : null;

              return (
                <tr key={pharmacy.pharmacy_id}>
                  <td className="px-4 py-2">{pharmacy.pharmacy_id}</td>

                  <td className="px-4 py-2 font-semibold">
                    {pharmacy.pharmacy_name}
                  </td>

                  <td className="px-4 py-2 uppercase text-sm">
                    {pharmacy.pharmacy_type}
                  </td>

                  <td className="px-4 py-2">{pharmacy.address}</td>

                  <td className="px-4 py-2">{pharmacy.contact_number}</td>

                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() =>
                        navigate(
                          pharmacy.status === "PENDING"
                            ? `/admin/pharmacy-review/${pharmacy.pharmacy_id}`
                            : `/admin/pharmacies/${pharmacy.pharmacy_id}`
                        )
                      }
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest text-white bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 shadow-lg shadow-emerald-500/20 ring-1 ring-white/10 hover:shadow-emerald-500/40 hover:scale-[1.02] transition"
                    >
                      {pharmacy.status === "PENDING" ? "Review" : "View / Manage"}
                    </button>
                  </td>

                  <td className="px-4 py-2 space-y-1">
                    {/* Status badge */}
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 shadow-[0_0_12px_rgba(0,0,0,0.15)] ${
                        pharmacy.status === "ACTIVE"
                          ? "bg-emerald-500/90 text-emerald-50 ring-emerald-300/60 shadow-[0_0_12px_rgba(16,185,129,0.45)]"
                          : pharmacy.status === "SUSPENDED"
                          ? "bg-amber-500/90 text-amber-50 ring-amber-300/60 shadow-[0_0_12px_rgba(245,158,11,0.45)]"
                          : pharmacy.status === "REMOVED"
                          ? "bg-rose-600 text-rose-50 ring-rose-300/60 shadow-[0_0_12px_rgba(244,63,94,0.5)]"
                          : "bg-slate-500 text-slate-50 ring-slate-300/60"
                      }`}
                    >
                      {pharmacy.status}
                    </span>

                    {/* Countdown badge (ONLY for REMOVED) */}
                    {pharmacy.status === "REMOVED" && daysLeft !== null && (
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 ring-1 ring-rose-200">
                        Auto delete in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-6 text-gray-400">
                No pharmacies to display
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PharmacyTable;
