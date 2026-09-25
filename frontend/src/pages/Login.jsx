import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building2, ArrowLeft, Mail, Lock, FileText, ShieldCheck } from 'lucide-react';
import { authService } from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('civilian'); // civilian, pharmacy
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    identifier: '', // email or license
    password: ''
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({ identifier: '', password: '' });
    setError('');
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (activeTab === 'civilian') {
        await authService.loginCivilian(formData.identifier, formData.password);
        navigate('/civilian');
      } else if (activeTab === 'pharmacy') {
        await authService.loginPharmacy(formData.identifier, formData.password);
        navigate('/pharmacy');
      }
    } catch (err) {
      console.error("Login failed", err);
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleConfig = () => {
    switch (activeTab) {
      case 'pharmacy':
        return {
          idLabel: 'Email Address',
          idPlaceholder: 'pharmacy@example.com'
        };
      default: // civilian
        return {
          idLabel: 'Email Address',
          idPlaceholder: 'name@example.com'
        };
    }
  };

  const config = getRoleConfig();

  return (
    <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 relative transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>

      {/* Back Button - Oval shape with Gradient Hover */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-2 px-5 py-2.5 bg-white text-gray-600 rounded-full shadow-sm border border-gray-100 transition-all duration-300 group hover:border-[#2FA4A9] hover:shadow-md overflow-hidden z-20"
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#2FA4A9] to-[#74c7c9] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
          <ArrowLeft size={18} />
          <span className="font-medium text-sm">Back to Home</span>
        </span>
      </button>

      {/* Container - Reduced Size with Enter Animation */}
      <div className={`grid grid-cols-1 md:grid-cols-2 rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full md:min-h-[500px] transform transition-all duration-700 ease-out ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}>

        {/* Left Side - Form */}
        <div className="bg-white p-8 md:p-10 flex flex-col justify-center relative z-10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Welcome back</h2>
            <p className="text-black font-medium text-sm text-opacity-80">Please enter your details to sign in.</p>
          </div>

          {/* Role Tabs - Animated & Themed */}
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'civilian', label: 'Civilian', icon: User },
                { id: 'pharmacy', label: 'Pharmacy', icon: Building2 }
              ].map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleTabChange(role.id)}
                  className={`relative flex flex-col items-center justify-center py-4 px-2 rounded-2xl border transition-all duration-300 group overflow-hidden ${activeTab === role.id
                    ? `border-transparent text-white shadow-xl transform scale-[1.02]`
                    : 'bg-white border-gray-100 text-gray-500 hover:border-[#2FA4A9]/30 hover:shadow-lg hover:-translate-y-1'
                    }`}
                >
                  {/* Active Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-[#2FA4A9] to-[#045D5D] transition-opacity duration-300 ${activeTab === role.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-10'}`}></div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center">
                    <role.icon size={22} className={`mb-2 transition-transform duration-300 ${activeTab === role.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span className="text-sm font-bold tracking-wide">{role.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center justify-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="group">
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide group-focus-within:text-[#2FA4A9] transition-colors">{config.idLabel}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2FA4A9] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleInputChange}
                  placeholder={config.idPlaceholder}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2FA4A9]/20 focus:border-[#2FA4A9] outline-none transition-all placeholder-gray-400 text-sm font-medium"
                  required
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide group-focus-within:text-[#2FA4A9] transition-colors">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2FA4A9] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2FA4A9]/20 focus:border-[#2FA4A9] outline-none transition-all placeholder-gray-400 text-sm font-medium"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-gray-900 to-black text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-gray-900/20 transform hover:-translate-y-0.5 transition-all duration-300 mt-4 text-sm tracking-wide flex items-center justify-center ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Sign In'
              )}
            </button>
            <div className="flex items-center justify-center mt-6">
              <p className="text-xs font-medium text-gray-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate(activeTab === 'pharmacy' ? '/pharmacy-signup' : '/register')}
                  className="font-bold text-[#2FA4A9] hover:text-[#1E8A8E] hover:underline transition-colors"
                >
                  {activeTab === 'pharmacy' ? 'Register the Pharmacy' : 'Sign up for free'}
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Right Side - Visual with Gradient and Animations */}
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-[#2FA4A9] via-[#208D92] to-[#0E5E62] text-white p-10 relative overflow-hidden">
          {/* Decorative Animated Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-10 translate-x-10 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl translate-y-10 -translate-x-10 animate-pulse duration-[4000ms]"></div>

          {/* Floating Circle */}
          <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-white/5 rounded-full blur-xl animate-bounce duration-[3000ms]"></div>

          <div className="relative z-10 max-w-xs text-center transform hover:scale-105 transition-transform duration-500">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20 ring-4 ring-white/5">
              <ShieldCheck size={44} className="text-white drop-shadow-md" />
            </div>

            <h2 className="text-3xl font-bold mb-4 drop-shadow-sm tracking-tight">Secure & Reliable</h2>
            <p className="text-teal-50 text-sm leading-relaxed font-medium opacity-90">
              Access the nation's most comprehensive medicine registry with real-time stock updates.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
