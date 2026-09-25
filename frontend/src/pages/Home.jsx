import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Activity, Users, ArrowRight } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">

      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 lg:px-24">
        <div className="flex items-center gap-2">
          <img
            src="/logo.jpeg"
            alt="FindMyMeds Logo"
            className="w-9 h-9 object-cover rounded-lg shadow-sm"
          />
          <span className="text-xl font-bold text-gray-800">FindMyMeds</span>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-full shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 lg:px-0 mt-10 mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-[#2FA4A9] rounded-full text-sm font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2FA4A9]" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2FA4A9]" />
          </span>
          Simplifying Healthcare Access
        </div>

        <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight max-w-4xl leading-tight">
          Find your medicines <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2FA4A9] to-[#74c7c9]">
            instantly & reliably.
          </span>
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mb-10 leading-relaxed">
          The unified platform connecting civilians, pharmacies, and administrators
          to ensure essential medicines are always within reach.
        </p>

        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-2xl hover:bg-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
        >
          Get Started <ArrowRight size={20} />
        </button>

        {/* Role Cards */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl px-6 w-full text-left">

          {/* Civilian */}
          <div
            onClick={() => navigate('/login')}
            className="cursor-pointer p-8 bg-white/60 backdrop-blur-xl border border-white/20 rounded-3xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">For Civilians</h3>
            <p className="text-gray-500">
              Search for medicines, reserve stocks, and track your requests in real-time.
            </p>
          </div>

          {/* Pharmacy */}
          <div
            onClick={() => navigate('/login')}
            className="cursor-pointer p-8 bg-white/60 backdrop-blur-xl border border-white/20 rounded-3xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 mb-6">
              <Activity size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">For Pharmacies</h3>
            <p className="text-gray-500">
              Manage inventory, process reservations, and ensure stock visibility.
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} FindMyMeds. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
