import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, FileText, Calendar, AlertTriangle } from 'lucide-react';
import CancelReservationModal from '../../components/civilian/CancelReservationModal';
// import '../../styles/civilian/ReservationDetailsPage.css'; // Assuming we use Tailwind or existing CSS

function ReservationDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8081/api/reservations/${id}/details`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setReservation(data);
            } else {
                setError("Failed to load reservation details.");
            }
        } catch (err) {
            setError("Error connecting to server.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        setShowCancelModal(false);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8081/api/reservations/${id}/cancel`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Refresh details to show cancelled status
                fetchDetails();
                // Optionally show success toast
            } else {
                alert("Failed to cancel reservation.");
            }
        } catch (err) {
            alert("Error cancelling reservation.");
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading details...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!reservation) return null;

    const { medicine, pharmacy, reservationDetails, billing } = reservation;
    const isActive = ['PENDING', 'APPROVED', 'CONFIRMED', 'ONGOING'].includes(reservationDetails.status);

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <button
                        onClick={() => navigate('/civilian/activity')}
                        className="flex items-center text-gray-600 hover:text-teal-600 transition-colors mb-2"
                    >
                        <ArrowLeft size={18} className="mr-2" />
                        Back to Your Activity
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {isActive ? 'Reservation Details' : 'Finished Reservation Details'}
                    </h1>
                    <p className="text-gray-500">
                        {isActive
                            ? 'View all details of your current reservation and manage it'
                            : 'View all details of your completed or cancelled reservation'}
                    </p>
                </div>
                <div>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold 
                        ${reservationDetails.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                            reservationDetails.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                reservationDetails.status === 'COLLECTED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {reservationDetails.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Medicine Details */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-teal-700 mb-4 border-b pb-2">Medicine Details</h2>
                    <ul className="space-y-3 text-sm">
                        <li className="flex justify-between"><span className="text-gray-500">Name:</span> <span className="font-medium text-gray-800">{medicine.name}</span></li>
                        <li className="flex justify-between"><span className="text-gray-500">Generic Name:</span> <span className="font-medium text-gray-800">{medicine.genericName}</span></li>
                        <li className="flex justify-between"><span className="text-gray-500">Category:</span> <span className="font-medium text-gray-800">{medicine.category}</span></li>
                        <li className="flex justify-between"><span className="text-gray-500">Prescription Required:</span> <span className="font-medium text-gray-800">{medicine.prescriptionRequired ? 'Yes' : 'No'}</span></li>
                        <li className="flex justify-between"><span className="text-gray-500">Quantity Reserved:</span> <span className="font-medium text-gray-800">{medicine.quantity}</span></li>
                    </ul>
                </div>

                {/* Pharmacy Details */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-teal-700 mb-4 border-b pb-2">Selected Pharmacy</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-gray-500 text-xs uppercase font-semibold">Pharmacy Name</p>
                            <p className="text-gray-800 font-medium">{pharmacy.name}</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin size={18} className="text-teal-500 mt-1" />
                            <div>
                                <p className="text-gray-500 text-xs uppercase font-semibold">Location</p>
                                <p className="text-gray-800">{pharmacy.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone size={18} className="text-teal-500" />
                            <div>
                                <p className="text-gray-500 text-xs uppercase font-semibold">Contact</p>
                                <p className="text-gray-800">{pharmacy.contact}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reservation Info */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-teal-700 mb-4 border-b pb-2">Reservation Info</h2>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Calendar size={18} className="text-teal-500" />
                            <div>
                                <p className="text-gray-500 text-xs">Pickup Date</p>
                                <p className="font-medium">{reservationDetails.pickupDate}</p>
                            </div>
                        </div>
                        {reservationDetails.prescriptionFile && (
                            <div className="flex items-center gap-3">
                                <FileText size={18} className="text-teal-500" />
                                <div>
                                    <p className="text-gray-500 text-xs">Prescription</p>
                                    <a href={reservationDetails.prescriptionFile} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline text-sm">View Uploaded File</a>
                                </div>
                            </div>
                        )}
                        {reservationDetails.notes && (
                            <div className="bg-gray-50 p-3 rounded-lg mt-2">
                                <p className="text-xs text-gray-500 mb-1">My Notes:</p>
                                <p className="text-sm text-gray-700 italic">"{reservationDetails.notes}"</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Billing Summary */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-teal-700 mb-4 border-b pb-2">Billing Summary</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">{medicine.name} (x{medicine.quantity})</span>
                            <span className="font-medium">Rs. {billing.total.toLocaleString()}</span>
                        </div>
                        <div className="border-t pt-2 mt-2 flex justify-between items-center text-lg font-bold text-teal-800">
                            <span>Grand Total</span>
                            <span>Rs. {billing.grandTotal.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-end gap-4">
                <button
                    onClick={() => navigate('/civilian/activity')}
                    className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                    Back to Activity
                </button>
                {isActive && (
                    <button
                        onClick={() => setShowCancelModal(true)}
                        className="px-6 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 font-medium hover:bg-red-100 transition-colors"
                    >
                        Cancel Reservation
                    </button>
                )}
            </div>

            {/* Cancel Modal */}
            {showCancelModal && (
                <CancelReservationModal
                    onConfirm={handleCancel}
                    onClose={() => setShowCancelModal(false)}
                />
            )}
        </div>
    );
}

export default ReservationDetailsPage;
