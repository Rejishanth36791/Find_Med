import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, BookOpen, MessageCircle, Bell, Flame, ArrowRight, Activity } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pharmaciesNearby: 0,
    activeReservations: 0,
    pendingInquiries: 0
  });
  const [notifications, setNotifications] = useState([]);

  const civilianId = 1;

  useEffect(() => {
    fetch(`http://localhost:8080/api/civilians/${civilianId}/dashboard-stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Failed to fetch dashboard stats", err));

    // Fetch only unread notifications for the civilian
    fetch(`http://localhost:8080/api/notification/read-status?userId=${civilianId}&isRead=false`)
      .then(res => res.json())
      .then(data => {
        // Get only the latest 5 unread notifications
        const latest5 = Array.isArray(data) ? data.slice(0, 5) : [];
        setNotifications(latest5);
      })
      .catch(err => console.error("Failed to fetch notifications", err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 pt-15 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* PRO WELCOME BANNER */}
        <section className="relative overflow-hidden rounded-[2.5rem] p-6 shadow-2xl shadow-[#2FA4A9]/20 transition-all duration-500 hover:shadow-[#2FA4A9]/30">
          {/* Brand Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#2FA4A9] via-[#2FA4A9] to-[#1e7a7e]"></div>

          {/* Decorative Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-lg"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/5 rounded-full -ml-10 -mb-10 blur-sm"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold tracking-widest uppercase">
                FindMyMeds Platform
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Your Health, <br />
                <span className="text-teal-100 italic">Simplified.</span>
              </h1>
              <p className="text-lg text-teal-50 max-w-xl font-medium leading-relaxed">
                Connect seamlessly with your local pharmacies. Locate essential medications,
                secure your prescriptions with instant reservations, and track your health
                journey—all in one smart dashboard.
              </p>
            </div>

            <button
              className="group flex items-center gap-3 bg-white text-[#2FA4A9] px-8 py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-teal-50 transform hover:-translate-y-1 transition-all duration-300"
              onClick={() => navigate("/civilian/reservation")}
            >
              Reserve Medicine
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </section>

        {/* DASHBOARD CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT SECTION (6 Cols) */}
          <div className="lg:col-span-6 space-y-8">

            {/* Main Pharmacy Card */}
            <div
              className="group relative bg-white p-8 rounded-[2rem] border border-[#2FA4A9]/10 shadow-sm hover:shadow-xl hover:shadow-[#2FA4A9]/10 transition-all duration-500 cursor-pointer overflow-hidden"
              onClick={() => navigate("/civilian/find-pharmacy")}
            >
              <div className="absolute top-0 right-0 p-8">
                <div className="p-4 bg-[#2FA4A9]/10 text-[#2FA4A9] rounded-2xl group-hover:scale-110 transition-transform duration-500">
                  <MapPin size={32} strokeWidth={2.5} />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-[#2FA4A9]">Pharmacies Nearby</h3>
                  <p className="text-slate-400 font-semibold mt-1 uppercase text-xs tracking-widest">Real-time Availability</p>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-[#2FA4A9] tracking-tighter">
                    {stats.pharmaciesNearby}
                  </span>
                  <span className="text-slate-400 font-bold">Pharmacies active now</span>
                </div>

                <div className="inline-flex items-center gap-2 text-[#2FA4A9] font-black group-hover:gap-4 transition-all">
                  Open Interactive Map <ArrowRight size={18} />
                </div>
              </div>
            </div>

            {/* Sub Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div
                className="bg-white p-8 rounded-[2rem] border border-[#2FA4A9]/10 shadow-sm hover:border-[#2FA4A9]/30 transition-all cursor-pointer group"
                onClick={() => navigate("/civilian/drug-dictionary")}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-teal-50 text-[#2FA4A9] rounded-xl group-hover:rotate-12 transition-transform">
                    <BookOpen size={24} />
                  </div>
                </div>
                <h3 className="text-xl font-black text-[#2FA4A9]">Drug Dictionary</h3>
                <p className="text-slate-500 text-sm mt-2 font-medium">Verify dosage and info before you reserve.</p>
                <div className="mt-6 text-sm font-black text-[#2FA4A9]/60 group-hover:text-[#2FA4A9]">Search Now →</div>
              </div>

              <div
                className="bg-white p-8 rounded-[2rem] border border-[#2FA4A9]/10 shadow-sm hover:border-[#2FA4A9]/30 transition-all cursor-pointer group"
                onClick={() => navigate("/civilian/inquiries")}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-teal-50 text-[#2FA4A9] rounded-xl group-hover:rotate-12 transition-transform">
                    <MessageCircle size={24} />
                  </div>
                </div>
                <h3 className="text-xl font-black text-[#2FA4A9]">Feedback Center</h3>
                <p className="text-slate-500 text-sm mt-2 font-medium">Make appeals and submit feedback.</p>
                <div className="mt-6 text-sm font-black text-[#2FA4A9]/60 group-hover:text-[#2FA4A9]">View Inbox →</div>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION (6 Cols) */}
          <div className="lg:col-span-6 space-y-8">

            {/* Notifications Card */}
            <div className="bg-white p-8 rounded-[2rem] border border-[#2FA4A9]/10 shadow-sm hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black text-[#2FA4A9]">Alert Center</h3>
                <div className="relative">
                  <Bell size={24} className="text-[#2FA4A9]/30" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 rounded-full border-2 border-white"></span>
                  )}
                </div>
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Activity size={20} className="text-slate-300" />
                  </div>
                  <p className="text-slate-400 text-sm font-bold italic">No unread notifications</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-3 bg-slate-50 rounded-lg border border-[#2FA4A9]/5 hover:bg-teal-50 hover:border-[#2FA4A9]/20 transition-all cursor-pointer"
                      onClick={() => navigate(`/civilian/notifications/${notif.id}`)}
                    >
                      <p className="text-sm font-semibold text-[#2FA4A9] truncate">{notif.title}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {notifications.length > 0 && (
                    <p
                      className="text-center text-xs text-[#2FA4A9] font-bold mt-4 cursor-pointer hover:underline"
                      onClick={() => navigate("/civilian/notifications")}
                    >
                      View all notifications →
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Trending Medicines Card */}
            <div className="bg-[#2FA4A9]/5 p-8 rounded-[2rem] border border-[#2FA4A9]/20 shadow-inner">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-[#2FA4A9]">Market Trends</h3>
                <Flame size={24} className="text-[#2FA4A9] animate-bounce" />
              </div>
              <div className="space-y-4">
                {[
                  { name: "Panadol", status: "High Demand" },
                  { name: "Vitamin C", status: "Trending" },
                  { name: "Amoxicillin", status: "Limited" }
                ].map((med, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm border border-[#2FA4A9]/5 transition-transform hover:scale-[1.02]">
                    <span className="text-[#2FA4A9] font-bold">{med.name}</span>
                    <span className="text-[10px] font-black uppercase tracking-tighter bg-[#2FA4A9]/10 px-2 py-1 rounded-md text-[#2FA4A9]">
                      {med.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;