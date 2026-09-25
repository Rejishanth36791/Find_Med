import { useState, useEffect } from 'react';
import { History, Settings, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReservationCard from '../../components/civilian/ReservationCard';
import '../../styles/civilian/ActivityPage.css';
import { getActivity } from '../../API/civilianApi';

function ActivityPage() {
    const navigate = useNavigate();
    const [currentReservations, setCurrentReservations] = useState([]);
    const [historyReservations, setHistoryReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const data = await getActivity();
            setCurrentReservations(data.activeReservations || []);
            setHistoryReservations(data.reservationHistory || []);
        } catch (error) {
            console.error("Error fetching activity:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (reservation) => {
        navigate(`/civilian/activity/reservation/${reservation.reservationId}`);
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Your Activity</h1>
                    <p className="text-gray-500 mt-1">Track your reservations and history</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                        <History size={16} />
                        History Log
                    </button>
                    {/* Settings button removed/placeholder if needed */}
                </div>
            </div>

            <div className="grid gap-8">
                {/* Active Reservations Section */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Current Reservations</h2>
                        <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                            {currentReservations.length}
                        </span>
                    </div>

                    {currentReservations.length === 0 ? (
                        <div className="bg-white rounded-xl p-8 text-center border border-gray-100 shadow-sm">
                            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <RefreshCw className="text-gray-400" size={24} />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No active reservations</h3>
                            <p className="text-gray-500 mt-1">You don't have any ongoing reservations at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentReservations.map((reservation) => (
                                <ReservationCard
                                    key={reservation.reservationId}
                                    reservation={{
                                        ...reservation,
                                        id: reservation.reservationId,
                                        pharmacy: reservation.pharmacyName,
                                        total: 0,
                                        date: reservation.reservationDate,
                                        time: "N/A"
                                    }}
                                    onViewDetails={handleViewDetails}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* History Section */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Reservation History</h2>
                        <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-0.5 rounded-full">
                            {historyReservations.length}
                        </span>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        {historyReservations.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-gray-500 italic">No past reservations found.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {historyReservations.map((reservation) => (
                                    <div
                                        key={reservation.reservationId}
                                        className="p-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between"
                                        onClick={() => handleViewDetails(reservation)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-2 h-2 rounded-full ${reservation.status === 'COLLECTED' ? 'bg-green-500' :
                                                reservation.status === 'CANCELLED' ? 'bg-red-500' : 'bg-gray-400'
                                                }`} />
                                            <div>
                                                <h4 className="font-medium text-gray-800">{reservation.medicineName}</h4>
                                                <p className="text-xs text-gray-500">{reservation.pharmacyName}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${reservation.status === 'COLLECTED' ? 'bg-green-100 text-green-700' :
                                                reservation.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {reservation.status}
                                            </span>
                                            <p className="text-xs text-gray-400 mt-1">{reservation.completedDate}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ActivityPage;
