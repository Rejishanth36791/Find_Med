import React, { useState, useEffect } from 'react';
import Layout from '../../components/pharmacy/Layout';
import { History, CheckCircle2, XCircle, User, Calendar, Package, Search, Filter } from 'lucide-react';

export default function ReservationHistory() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/pharmacy/reservations/history');
      if (response.data) {
        setReservations(response.data);
      }
    } catch (error) {
      console.error('Error fetching reservation history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReservations = reservations.filter(res => {
    const matchesStatus = filterStatus === 'ALL' || res.status === filterStatus;
    const matchesSearch = !searchQuery ||
      res.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.civilian?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: reservations.length,
    collected: reservations.filter(r => r.status === 'COLLECTED').length,
    cancelled: reservations.filter(r => r.status === 'CANCELLED' || r.status === 'REJECTED').length,
    totalRevenue: reservations
      .filter(r => r.status === 'COLLECTED')
      .reduce((sum, r) => sum + (r.totalAmount || 0), 0)
  };

  return (
    <Layout title="Reservation History">
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Total Orders" value={stats.total} color="gray" />
          <StatCard label="Completed" value={stats.collected} color="green" />
          <StatCard label="Cancelled" value={stats.cancelled} color="red" />
          <StatCard label="Revenue" value={`LKR ${stats.totalRevenue.toLocaleString()}`} color="primary" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID or customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm"
              />
            </div>
            <div className="flex gap-2">
              {['ALL', 'COLLECTED', 'CANCELLED'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-5 py-3 rounded-xl text-sm font-bold transition ${filterStatus === status
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  {status === 'ALL' ? 'All' : status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* History List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-gray-100">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <History size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">No history found</h3>
            <p className="text-gray-500 mt-2">Completed and cancelled orders will appear here.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Items</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredReservations.map((res) => (
                  <tr key={res.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-800">#{res.id.substring(0, 8)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-xl text-gray-400">
                          <User size={16} />
                        </div>
                        <span className="font-medium text-gray-700">{res.civilian?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(res.reservationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-bold text-gray-600">
                        {res.items?.length || 0} items
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      LKR {res.totalAmount?.toLocaleString() || '0'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${res.status === 'COLLECTED'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                        }`}>
                        {res.status === 'COLLECTED' ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 size={12} /> Completed
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <XCircle size={12} /> Cancelled
                          </span>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Items</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredReservations.map((res) => (
                    <tr key={res.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-800">#{typeof res.id === 'string' ? res.id.substring(0, 8) : res.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-100 p-2 rounded-xl text-gray-400">
                            <User size={16} />
                          </div>
                          <span className="font-medium text-gray-700">{res.civilian?.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {res.reservationDate ? new Date(res.reservationDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-bold text-gray-600">
                          {res.items?.length || 0} items
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        LKR {(res.totalAmount || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${res.status === 'COLLECTED'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                          }`}>
                          {res.status === 'COLLECTED' ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle2 size={12} /> Completed
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <XCircle size={12} /> {res.status}
                            </span>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function StatCard({ label, value, color }) {
  const colorClasses = {
    gray: 'bg-gray-50 text-gray-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    primary: 'bg-primary/10 text-primary'
  };

  return (
    <div className={`rounded-2xl p-5 ${colorClasses[color]}`}>
      <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">{label}</p>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
}
