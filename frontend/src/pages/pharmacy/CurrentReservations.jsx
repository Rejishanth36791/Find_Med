import { useState, useEffect } from 'react'
import {
  Package, CheckCircle, XCircle, Clock, Truck, Clipboard,
  ArrowLeft, Printer, Download, MapPin, Phone, FileText,
  ChevronRight, Info, User, Calendar
} from 'lucide-react'
import Layout from '../../components/pharmacy/Layout'

export default function CurrentReservations() {
  const [activeStatus, setActiveStatus] = useState('PENDING')
  const [viewMode, setViewMode] = useState('list') // 'list' or 'details'
  const [selectedRes, setSelectedRes] = useState(null)
  const [reservations, setReservations] = useState([])
  const [counts, setCounts] = useState([0, 0, 0, 0, 0, 0])
  const [loading, setLoading] = useState(true)

  const statusCards = [
    { status: 'PENDING', label: 'Pending', icon: Clock, color: 'bg-orange-500', index: 0 },
    { status: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle, color: 'bg-blue-500', index: 1 },
    { status: 'ONGOING', label: 'Ongoing', icon: Clipboard, color: 'bg-purple-500', index: 2 },
    { status: 'READY', label: 'Ready for Pickup', icon: Truck, color: 'bg-teal-500', index: 3 },
    { status: 'COLLECTED', label: 'Marked as Collected', icon: Package, color: 'bg-emerald-600', index: 4 },
    { status: 'CANCELLED', label: 'Rejected', icon: XCircle, color: 'bg-red-500', index: 5 },
  ]

  const getHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('pharmacyToken')}`
  })

  useEffect(() => {
    fetchCounts()
    fetchReservations()
  }, [activeStatus])

  const fetchCounts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/pharmacy/reservations/current/counts', { headers: getHeaders() })
      if (response.ok) {
        const data = await response.json()
        setCounts(data)
      }
    } catch (error) { console.error('Counts fetch error:', error) }
  }

  const fetchReservations = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8080/api/pharmacy/reservations/current?status=${activeStatus}&page=0&size=10`, { headers: getHeaders() })
      if (response.ok) {
        const data = await response.json()
        setReservations(data)
      }
    } catch (error) {
      console.error('Reservations fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:8080/api/pharmacy/reservations/current/${id}/status?status=${status}`, {
        method: 'PATCH',
        headers: getHeaders()
      });
      if (response.ok) {
        fetchCounts()
        if (viewMode === 'details') {
          handleViewDetails(id)
        } else {
          fetchReservations()
        }
      }
    } catch (error) { console.error('Update status error:', error) }
  }

  const handleViewDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/pharmacy/reservations/current/${id}`, { headers: getHeaders() })
      if (response.ok) {
        setSelectedRes(await response.json())
        setViewMode('details')
      }
    } catch (error) { console.error('Details fetch error:', error) }
  }



  if (viewMode === 'details' && selectedRes) {
    return (
      <Layout title="Reservation Details">
        <div className="max-w-7xl mx-auto space-y-6 pb-20">
          <div className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setViewMode('list')}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Reservation: #{selectedRes.id}</h1>
                <p className="text-gray-500 font-medium">Status:
                  <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold text-white ${statusCards.find(c => c.status === selectedRes.status)?.color}`}>
                    {selectedRes.status}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {selectedRes.status === 'PENDING' && (
                <>
                  <button onClick={() => handleUpdateStatus(selectedRes.id, 'CONFIRMED')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition shadow-md">
                    <CheckCircle size={18} /> Confirm Reservation
                  </button>
                  <button onClick={() => handleUpdateStatus(selectedRes.id, 'CANCELLED')} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition shadow-md">
                    <XCircle size={18} /> Reject
                  </button>
                </>
              )}
              {selectedRes.status === 'CONFIRMED' && (
                <button onClick={() => handleUpdateStatus(selectedRes.id, 'ONGOING')} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition shadow-md">
                  Mark as Ongoing
                </button>
              )}
              {selectedRes.status === 'ONGOING' && (
                <button onClick={() => handleUpdateStatus(selectedRes.id, 'READY')} className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition shadow-md">
                  Mark as Ready for Pickup
                </button>
              )}
              {selectedRes.status === 'READY' && (
                <button onClick={() => handleUpdateStatus(selectedRes.id, 'COLLECTED')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition shadow-md">
                  Mark Collected
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border">
                <h3 className="text-lg font-bold border-b pb-4 mb-4 flex items-center gap-2 text-gray-700">
                  <Package size={20} className="text-primary" /> Customer Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center text-primary">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Full Name</p>
                      <p className="font-bold text-gray-800">{selectedRes.civilian?.name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center text-primary">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Phone Number</p>
                      <p className="font-bold text-gray-800">{selectedRes.civilian?.phone || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center text-primary">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Email</p>
                      <p className="font-bold text-gray-800 leading-tight">{selectedRes.civilian?.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border">
                <h3 className="text-lg font-bold border-b pb-4 mb-4 flex items-center gap-2 text-gray-700">
                  <Info size={20} className="text-primary" /> Reservation Information
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Reservation ID</span>
                    <span className="font-bold text-gray-800">#{selectedRes.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Date</span>
                    <span className="font-bold text-gray-800">{selectedRes.reservationDate ? new Date(selectedRes.reservationDate).toLocaleString() : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Status</span>
                    <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold uppercase">{selectedRes.status}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                    <Clipboard size={20} className="text-primary" /> Medicines Ordered
                  </h3>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Medicine Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Quantity</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Price (Rs.)</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedRes.items?.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition">
                        <td className="px-6 py-4 font-bold text-gray-800">{item.medicine?.medicineName || 'Unknown'}</td>
                        <td className="px-6 py-4 font-bold text-gray-800 text-center">{item.quantity}</td>
                        <td className="px-6 py-4 font-medium text-gray-800 text-right">{item.price?.toFixed(2)}</td>
                        <td className="px-6 py-4 font-bold text-primary text-right">{((item.price || 0) * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                  <h3 className="text-lg font-bold mb-4 text-gray-700">Prescription</h3>
                  <div className="aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                    <FileText size={48} className="mb-2 opacity-20" />
                    <p className="text-sm font-medium">Digital Prescription Attachment</p>
                    <div className="mt-4 flex gap-2">
                      <button className="px-4 py-2 bg-white border shadow-sm rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50">View</button>
                      <button className="px-4 py-2 bg-teal-500 text-white rounded-lg text-xs font-bold hover:bg-teal-600">Download</button>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                  <h3 className="text-lg font-bold mb-4 text-gray-700 tracking-tight">Billing Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-500">
                      <span>Total Items</span>
                      <span className="font-bold text-gray-800">{selectedRes.items?.length || 0} items</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span className="font-bold text-gray-800">Rs. {selectedRes.totalAmount?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 border-b pb-3">
                      <span>Processing Fee</span>
                      <span className="font-bold text-gray-800">Rs. 0.00</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xl font-extrabold text-gray-800 italic uppercase">Final Total</span>
                      <span className="text-2xl font-black text-primary">Rs. {selectedRes.totalAmount?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-2xl shadow-sm border">
            <h3 className="text-lg font-bold mb-8 text-gray-700 uppercase tracking-widest text-center">Timeline Tracker</h3>
            <div className="flex items-center w-full max-w-4xl mx-auto overflow-x-auto pb-4">
              {['Pending', 'Confirmed', 'Ongoing', 'Ready', 'Collected'].map((step, i) => {
                const currentIndex = statusCards.findIndex(c => c.status === selectedRes.status);
                const isCompleted = i < currentIndex;
                const isCurrent = i === currentIndex;

                return (
                  <div key={step} className="flex-1 flex items-center min-w-[120px]">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all shadow-md
                            ${isCompleted ? 'bg-primary border-primary text-white' :
                          isCurrent ? 'bg-white border-primary text-primary scale-110 z-10' :
                            'bg-white border-gray-100 text-gray-300'}`}>
                        {isCompleted ? <CheckCircle size={20} /> : <span className="font-bold">{i + 1}</span>}
                      </div>
                      <span className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase whitespace-nowrap tracking-tighter
                            ${isCurrent ? 'text-primary' : 'text-gray-400'}`}>
                        {step}
                      </span>
                    </div>
                    {i < 4 && (
                      <div className={`flex-1 h-1.5 mx-2 rounded-full transition-all ${i < currentIndex ? 'bg-primary' : 'bg-gray-100'}`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t p-4 flex justify-between px-12 z-50">
            <button
              onClick={() => setViewMode('list')}
              className="px-8 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-bold flex items-center gap-2 transition"
            >
              <ArrowLeft size={20} /> Back to Reservations
            </button>
            <div className="flex gap-4">
              <button className="p-3 bg-white border rounded-xl hover:bg-gray-50 shadow-sm transition"><Printer size={20} /></button>
              <button className="p-3 bg-white border rounded-xl hover:bg-gray-50 shadow-sm transition"><Download size={20} /></button>
              <button className="px-10 py-3 bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-500/30 hover:bg-teal-700 transition">Download Summary</button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Current Reservations">
      <div className="max-w-8xl mx-auto space-y-8">
        <div>
          <h1 className="text-5xl font-black text-gray-900 leading-tight">Current Reservations</h1>
          <p className="text-2xl text-gray-500 mt-2 font-medium">Manage and process all incoming medicine reservations</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {statusCards.map((card) => {
            const Icon = card.icon;
            const isActive = activeStatus === card.status;
            return (
              <div
                key={card.status}
                onClick={() => setActiveStatus(card.status)}
                className={`p-6 rounded-3xl shadow-xl cursor-pointer transition-all duration-500 transform border-2 flex flex-col items-center text-center
                  ${isActive
                    ? `${card.color} text-white border-white ring-8 ring-primary/5 scale-105`
                    : 'bg-white border-transparent text-gray-500 hover:border-gray-100 hover:scale-102 hover:shadow-2xl'
                  }`}
              >
                <div className={`mb-4 p-3 rounded-2xl ${isActive ? 'bg-white/20' : 'bg-gray-50'}`}>
                  <Icon size={32} className={isActive ? 'text-white' : 'text-gray-400'} />
                </div>
                <p className={`text-4xl font-black mb-1 ${isActive ? 'text-white' : 'text-gray-800'}`}>
                  {counts[card.index] || 0}
                </p>
                <p className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                  {card.label}
                </p>
              </div>
            )
          })}
        </div>

        <div className="bg-white rounded-[40px] shadow-3xl border border-gray-100 overflow-hidden min-h-[500px]">
          <div className="p-12 border-b bg-gradient-to-br from-teal-500/[0.03] to-primary/[0.02]">
            <h2 className="text-3xl font-black text-gray-800 flex items-center gap-4">
              {activeStatus} Reservations
              <span className="px-4 py-1.5 bg-gray-100 rounded-full text-sm font-bold text-gray-500 uppercase tracking-widest">Live View</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-[0.2em] text-gray-400">ID</th>
                  <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-[0.2em] text-gray-400">Customer Info</th>
                  <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-[0.2em] text-gray-400">Dates (Res/Pick)</th>
                  <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-[0.2em] text-gray-400 text-center">Items/Qty</th>
                  <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-[0.2em] text-gray-400 text-right">Total Amount</th>
                  <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                  <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-[0.2em] text-gray-400 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-32 text-gray-300 font-bold animate-pulse text-2xl uppercase tracking-widest">Syncing with server...</td></tr>
                ) : reservations.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-32">
                      <Package size={64} className="mx-auto mb-6 text-gray-100" />
                      <p className="text-gray-400 text-xl font-bold uppercase tracking-widest">No reservations in this queue</p>
                    </td>
                  </tr>
                ) : (
                  reservations.map((res) => (
                    <tr key={res.id} className="hover:bg-teal-50/30 transition-all duration-300 group">
                      <td className="px-8 py-8 font-black text-gray-800 tracking-tighter">#{res.id.substring(0, 8)}</td>
                      <td className="px-8 py-8">
                        <p className="font-extrabold text-lg text-gray-800 underline decoration-primary/20">{res.civilian?.name || 'Unknown'}</p>
                        <p className="text-xs font-bold text-gray-400 flex items-center gap-1 mt-1"><User size={10} /> {res.civilian?.email || 'N/A'}</p>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-gray-400 flex items-center gap-2">
                            <Clock size={12} className="text-blue-400" /> {res.reservationDate ? new Date(res.reservationDate).toLocaleDateString() : 'N/A'}
                          </span>
                          <span className="text-xs font-bold text-gray-400 flex items-center gap-2">
                            <Truck size={12} className="text-primary" /> {res.timeframe || 'Scheduled'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-8 text-center">
                        <div className="inline-flex flex-col">
                          <span className="px-3 py-1 bg-teal-50 text-primary text-[10px] font-black rounded-lg uppercase tracking-wider">{res.items?.length || 0} Meds</span>
                          <span className="text-xs font-bold text-gray-400 mt-1">{res.items?.reduce((sum, item) => sum + item.quantity, 0) || 0} Units</span>
                        </div>
                      </td>
                      <td className="px-8 py-8 text-right font-black text-2xl text-teal-600 tracking-tighter">Rs.{res.totalAmount?.toFixed(2)}</td>
                      <td className="px-8 py-8">
                        <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg
                          ${statusCards.find(c => c.status === res.status)?.color}`}>
                          {res.status}
                        </span>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleViewDetails(res.id)}
                            className="bg-primary text-white p-3 rounded-2xl shadow-lg hover:bg-primary-dark transition-all transform hover:scale-110 active:scale-95"
                            title="View Details"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
