import { useState, useEffect } from 'react';
import { Search, Plus, Pill, FileText, MapPin } from 'lucide-react';
import PharmacyCard from '../../components/civilian/PharmacyCard';
import ReservationForm from '../../components/civilian/ReservationForm';
import '../../styles/civilian/ReservationPage.css';
import { searchMedicines, recommendPharmacies, confirmReservation } from '../../API/civilianApi';
import { useAuth } from '../../context/AuthContext';

function ReservationPage() {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedPharmacy, setSelectedPharmacy] = useState(null);
    const [medicines, setMedicines] = useState([]);
    const [pharmacies, setPharmacies] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [locationStatus, setLocationStatus] = useState('prompt');

    useEffect(() => {
        // Try to get location on mount
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setLocationStatus('granted');
                },
                (error) => {
                    console.error("Location access denied or error:", error);
                    setLocationStatus('denied');
                }
            );
        }
    }, []);

    useEffect(() => {
        if (searchQuery.length > 2) {
            handleSearchMedicines(searchQuery);
        } else {
            setMedicines([]);
        }
    }, [searchQuery]);

    const handleSearchMedicines = async (query) => {
        try {
            const data = await searchMedicines(query);
            setMedicines(data);
        } catch (err) {
            console.error("Failed to fetch medicines", err);
        }
    };

    const handleMedicineSelect = async (med) => {
        setSelectedMedicine(med);
        setSearchQuery(med.medicineName);
        setMedicines([]); // Hide dropdown
        setPharmacies([]); // Clear previous pharmacies
        setSelectedPharmacy(null);

        // Fetch recommended pharmacies
        try {
            setLoading(true);
            const lat = userLocation?.lat;
            const lng = userLocation?.lng;
            const data = await recommendPharmacies(med.id, quantity, lat, lng);

            // Transform data if needed for card
            const formattedPharmacies = data.map(p => ({
                id: p.pharmacyId,
                name: p.pharmacyName,
                address: p.location,
                distance: p.distance,
                price: p.price,
                availableQuantity: p.availableQuantity,
                status: 'ACTIVE' // Assuming active if returned
            }));

            setPharmacies(formattedPharmacies);
        } catch (err) {
            console.error("Failed to fetch pharmacies", err);
        } finally {
            setLoading(false);
        }
    };

    const handlePharmacySelect = (pharmacy) => {
        setSelectedPharmacy(pharmacy);
    };

    // Refresh pharmacies when quantity changes if medicine is selected
    useEffect(() => {
        if (selectedMedicine) {
            const timer = setTimeout(() => {
                handleMedicineSelect(selectedMedicine);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [quantity]);

    const handleSubmit = async (reservationData) => {
        if (!selectedMedicine || !selectedPharmacy) {
            alert("Please select a medicine and a pharmacy.");
            return;
        }

        const payload = {
            civilianId: user.id,
            medicineId: selectedMedicine.id,
            pharmacyId: selectedPharmacy.id,
            quantity: quantity,
            pickupDate: reservationData.pickupDate,
            notes: reservationData.note,
            prescriptionFile: reservationData.prescription ? reservationData.prescription.name : null, // Handle file upload properly in real app
            totalAmount: reservationData.total
        };

        try {
            const result = await confirmReservation(payload);
            if (result) {
                alert('Reservation confirmed! You can view it in your Activity Page.');
                // Reset form
                setSelectedMedicine(null);
                setSelectedPharmacy(null);
                setQuantity(1);
                setSearchQuery('');
                setPharmacies([]);
            }
        } catch (err) {
            console.error("Error submitting reservation", err);
            alert("Failed to confirm reservation. Please try again.");
        }
    };

    const handleCancel = () => {
        setSelectedPharmacy(null);
    };

    return (
        <div className="reservation-page">
            <section className="search-section">
                <header className="mb-6 flex justify-between items-center">
                    <div>
                        <h2 className="section-header mb-1">Find & Reserve Medicines</h2>
                        <p className="text-gray-500 text-sm">Search for medication and find nearby pharmacies.</p>
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin size={14} />
                        {locationStatus === 'granted' ? 'Location Active' : 'Location Not Active'}
                    </div>
                </header>

                <div className="search-container">
                    <div className="search-bar">
                        <div className="search-input-wrapper">
                            <Search />
                            <input
                                type="text"
                                placeholder="Search medicines by name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {medicines.length > 0 && (
                        <div className="medicine-dropdown bg-white border rounded mt-2 shadow-lg max-h-60 overflow-y-auto z-10 relative">
                            {medicines.map(med => (
                                <div
                                    key={med.id}
                                    className="p-3 hover:bg-gray-100 cursor-pointer border-b"
                                    onClick={() => handleMedicineSelect(med)}
                                >
                                    <div className="font-bold">{med.medicineName}</div>
                                    <div className="text-xs text-gray-500">{med.genericName}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    <span className="section-label mt-6 block">Selected Medicine</span>

                    {selectedMedicine ? (
                        <div className="medicine-suggestion">
                            <div className="suggestion-title">{selectedMedicine.medicineName}</div>
                            <div className="med-tags">
                                <span className="med-tag"><Pill size={12} style={{ marginRight: 5 }} /> {selectedMedicine.dosageForm || 'N/A'}</span>
                                {selectedMedicine.requiresPrescription && (
                                    <span className="med-tag warning"><FileText size={12} style={{ marginRight: 5 }} /> Prescription Required</span>
                                )}
                            </div>
                            <p className="suggestion-desc">
                                {selectedMedicine.description || 'No description available.'}
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-400 italic mb-4">Search and select a medicine to proceed.</p>
                    )}

                    <div className="action-row">
                        <div className="qty-stepper">
                            <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                            <input type="text" value={quantity} className="qty-input" readOnly />
                            <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
                        </div>
                        <button
                            className="btn btn-primary"
                            style={{ flex: 1 }}
                            disabled={!selectedMedicine}
                            onClick={() => { }}
                        >
                            {selectedMedicine ? `Est. Price around` : 'Result'}
                        </button>
                    </div>
                </div>

                <h2 className="section-header" style={{ marginTop: 20 }}>Select Pharmacy</h2>
                <div className="pharmacy-list-card">
                    <div className="pharmacy-list">
                        {loading && <p className="p-4 text-gray-500">Searching nearby pharmacies...</p>}
                        {!loading && pharmacies.length === 0 && selectedMedicine && (
                            <p className="p-4 text-gray-500">No pharmacies found with stock.</p>
                        )}
                        {!loading && pharmacies.length === 0 && !selectedMedicine && (
                            <p className="p-4 text-gray-500">Select a medicine to see pharmacies.</p>
                        )}

                        {pharmacies.map((pharmacy) => (
                            <PharmacyCard
                                key={pharmacy.id}
                                pharmacy={pharmacy}
                                isSelected={selectedPharmacy?.id === pharmacy.id}
                                onSelect={handlePharmacySelect}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="reservation-section">
                <h2 className="section-header">Your Reservation</h2>
                <ReservationForm
                    selectedPharmacy={selectedPharmacy}
                    orderItems={selectedMedicine ? [{
                        name: selectedMedicine.medicineName,
                        quantity: quantity,
                        price: selectedPharmacy ? selectedPharmacy.price : 0, // Use price from pharmacy inventory
                        requiresPrescription: selectedMedicine.requiresPrescription
                    }] : []}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </section>
        </div>
    );
}

export default ReservationPage;
