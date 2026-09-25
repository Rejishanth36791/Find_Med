import React, { useState, useEffect } from 'react';
import { Search, MapPin, Pill, Calendar, FileText, CheckCircle, AlertCircle, ShoppingBag } from 'lucide-react';
import PharmacyMap from '../../components/civilian/PharmacyMap'; // Ensure correct path
// import api from '../../services/api'; // Placeholder for API

const CivilianReservation = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Step 1: Medicine Selection
    const [medicineSearch, setMedicineSearch] = useState('');
    const [medicines, setMedicines] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // Step 2: Pharmacy Selection
    const [pharmacies, setPharmacies] = useState([]);
    const [selectedPharmacy, setSelectedPharmacy] = useState(null);
    const [userLocation, setUserLocation] = useState({ lat: 6.9271, lng: 79.8612 }); // Default Colombo

    // Step 3: Reservation Details
    const [pickupDate, setPickupDate] = useState('');
    const [prescriptionFile, setPrescriptionFile] = useState(null);
    const [notes, setNotes] = useState('');
    const [reservationSuccess, setReservationSuccess] = useState(false);

    // Mock API calls (Replace with actual fetch)
    const searchMedicines = async (query) => {
        if (!query) return;
        setLoading(true);
        try {
            // const res = await api.get(`/reservations/medicines/search?name=${query}`);
            const res = await fetch(`http://localhost:8080/api/reservations/medicines/search?name=${query}`);
            if (res.ok) {
                const data = await res.json();
                setMedicines(data);
            }
        } catch (error) {
            console.error("Error searching medicines", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecommendedPharmacies = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/api/reservations/recommend-pharmacies`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    medicineId: selectedMedicine.id,
                    requiredQuantity: quantity,
                    userLocation: "Colombo" // Placeholder
                })
            });
            if (res.ok) {
                const data = await res.json();
                // Map API response to PharmacyMap expectation
                const mapped = data.map(p => ({
                    id: p.pharmacyId,
                    name: p.pharmacyName,
                    latitude: p.latitude,
                    longitude: p.longitude,
                    available: p.availableQuantity,
                    address: p.location,
                    price: p.price // Real price from backend
                }));
                setPharmacies(mapped);
            }
        } catch (error) {
            console.error("Error fetching pharmacies", error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmReservation = async () => {
        setLoading(true);
        try {
            // Mock Civilian ID (Replace with Auth Context)
            const civilianId = 1;

            const res = await fetch(`http://localhost:8080/api/reservations/confirm`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    civilianId,
                    medicineId: selectedMedicine.id,
                    pharmacyId: selectedPharmacy.id,
                    quantity,
                    pickupDate,
                    notes,
                    prescriptionFile: prescriptionFile ? "file_path_placeholder" : null
                })
            });

            if (res.ok) {
                setReservationSuccess(true);
            } else {
                alert("Failed to confirm reservation");
            }
        } catch (error) {
            console.error("Error confirming reservation", error);
            alert("Error confirming reservation");
        } finally {
            setLoading(false);
        }
    };

    // Effects
    useEffect(() => {
        // Debounce search
        const delayDebounceFn = setTimeout(() => {
            if (medicineSearch) {
                searchMedicines(medicineSearch);
            } else {
                setMedicines([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [medicineSearch]);

    useEffect(() => {
        if (selectedMedicine && step === 2) {
            fetchRecommendedPharmacies();
        }
    }, [step, selectedMedicine]);

    // Render Steps
    const renderStep1 = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif text-slate-800">Find & Select Medicine</h2>
            <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" />
                <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="Search for medicines (e.g. Panadol)"
                    value={medicineSearch}
                    onChange={(e) => setMedicineSearch(e.target.value)}
                />
            </div>

            {medicines.length > 0 && !selectedMedicine && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {medicines.map((med) => (
                        <div key={med.id}
                            onClick={() => setSelectedMedicine(med)}
                            className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md cursor-pointer border border-transparent hover:border-emerald-200 transition-all"
                        >
                            <h3 className="font-bold text-lg text-slate-800">{med.medicineName}</h3>
                            <p className="text-sm text-gray-500">{med.genericName}</p>
                            {med.prescriptionRequired && (
                                <span className="inline-block mt-2 px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Prescription Required</span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {selectedMedicine && (
                <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-emerald-900">{selectedMedicine.medicineName}</h3>
                            <p className="text-emerald-700">{selectedMedicine.genericName}</p>
                        </div>
                        <button onClick={() => setSelectedMedicine(null)} className="text-gray-400 hover:text-red-500">Change</button>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-emerald-800 mb-2">Required Quantity</label>
                        <div className="flex items-center space-x-4">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 bg-white rounded-lg border border-emerald-200 hover:bg-emerald-100">-</button>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                className="w-20 text-center p-2 rounded-lg border-emerald-200 focus:ring-emerald-500"
                            />
                            <button onClick={() => setQuantity(quantity + 1)} className="p-2 bg-white rounded-lg border border-emerald-200 hover:bg-emerald-100">+</button>
                        </div>
                        <p className="text-xs text-emerald-600 mt-2">Select the quantity strictly required for your treatment.</p>
                    </div>

                    <div className="mt-6 text-right">
                        <button
                            onClick={() => setStep(2)}
                            className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all font-medium"
                        >
                            Find Pharmacies
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    const renderStep2 = () => (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-serif text-slate-800">Recommended Pharmacies</h2>
                <button onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-700">Back</button>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                <div className="lg:col-span-1 overflow-y-auto pr-2 space-y-4">
                    {loading ? <p>Loading pharmacies...</p> : pharmacies.map((pharmacy) => (
                        <div
                            key={pharmacy.id}
                            onClick={() => setSelectedPharmacy(pharmacy)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedPharmacy?.id === pharmacy.id ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500' : 'bg-white border-gray-200 hover:border-emerald-300'}`}
                        >
                            <h3 className="font-bold text-slate-800">{pharmacy.name}</h3>
                            <p className="text-sm text-gray-500">{pharmacy.address}</p>
                            <div className="mt-3 flex justify-between items-center">
                                <span className={`text-xs px-2 py-1 rounded-full ${pharmacy.available >= quantity ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {pharmacy.available} in stock
                                </span>
                                {pharmacy.price && <span className="text-sm font-bold text-slate-700">${pharmacy.price}</span>}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-2 bg-gray-100 rounded-xl overflow-hidden h-96 lg:h-auto">
                    <PharmacyMap
                        userLocation={userLocation}
                        pharmacies={pharmacies}
                        onSelectPharmacy={setSelectedPharmacy}
                    />
                </div>
            </div>

            {selectedPharmacy && (
                <div className="mt-6 text-right">
                    <button
                        onClick={() => setStep(3)}
                        className="px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all font-medium"
                    >
                        Proceed to Reservation
                    </button>
                </div>
            )}
        </div>
    );

    const renderStep3 = () => (
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-serif text-slate-800">Finalize Reservation</h2>
                <button onClick={() => setStep(2)} className="text-gray-500 hover:text-gray-700">Back</button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
                {/* Order Summary */}
                <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                    <h3 className="font-bold text-gray-900 border-b pb-2">Order Summary</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Medicine</p>
                            <p className="font-semibold">{selectedMedicine?.medicineName}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Quantity</p>
                            <p className="font-semibold">{quantity}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Pharmacy</p>
                            <p className="font-semibold">{selectedPharmacy?.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Location</p>
                            <p className="font-medium truncate">{selectedPharmacy?.address}</p>
                        </div>
                    </div>
                </div>

                {/* Pickup Details */}
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-900">Pickup Details</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Pickup Date</label>
                        <input
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            value={pickupDate}
                            onChange={(e) => setPickupDate(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-200 focus:ring-emerald-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Reservation valid for 2 pharmacy working days from this date.</p>
                    </div>

                    {selectedMedicine?.prescriptionRequired && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Prescription</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="file"
                                    className="hidden"
                                    id="prescription-upload"
                                    onChange={(e) => setPrescriptionFile(e.target.files[0])}
                                />
                                <label htmlFor="prescription-upload" className="cursor-pointer">
                                    <FileText className="mx-auto h-8 w-8 text-gray-400" />
                                    <span className="mt-2 block text-sm font-medium text-gray-600">
                                        {prescriptionFile ? prescriptionFile.name : "Click to upload image or PDF"}
                                    </span>
                                </label>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                        <textarea
                            rows="3"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-200 focus:ring-emerald-500"
                            placeholder="Special instructions..."
                        ></textarea>
                    </div>
                </div>

                {/* Confirmation */}
                <div className="pt-4 border-t">
                    <label className="flex items-start space-x-3">
                        <input type="checkbox" className="mt-1 h-4 w-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500" />
                        <span className="text-sm text-gray-600">I confirm this reservation and understand I must collect it before expiry. Payment will be made at the pharmacy.</span>
                    </label>
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        onClick={() => setStep(1)} // Reset or Cancel
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirmReservation}
                        disabled={!pickupDate || (selectedMedicine?.prescriptionRequired && !prescriptionFile) || loading}
                        className={`px-8 py-3 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-200 font-medium ${(!pickupDate || (selectedMedicine?.prescriptionRequired && !prescriptionFile) || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-700'
                            }`}
                    >
                        {loading ? 'Processing...' : 'Confirm Reservation'}
                    </button>
                </div>
            </div>
        </div>
    );

    const renderSuccess = () => (
        <div className="max-w-2xl mx-auto text-center py-12">
            <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Reservation Successful!</h2>
            <p className="text-gray-600 mb-8">
                Your reservation for <span className="font-semibold text-gray-900">{selectedMedicine?.medicineName}</span> at <span className="font-semibold text-gray-900">{selectedPharmacy?.name}</span> is now
                <span className="inline-block mx-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold align-middle">PENDING</span>.
            </p>
            <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm mb-8 inline-block text-left">
                <p className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>Please monitor your <strong>Activity Page</strong>. The pharmacy will review your request shortly. Once APPROVED, you can proceed to collect your medicine.</span>
                </p>
            </div>
            <div>
                <button
                    onClick={() => setReservationSuccess(false) || setStep(1) || setSelectedMedicine(null)}
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-medium"
                >
                    Make Another Reservation
                </button>
            </div>
        </div>
    );

    return (
        <div className="h-full">
            {reservationSuccess ? renderSuccess() : (
                <>
                    {/* Progress Indicator */}
                    <div className="mb-8 flex justify-center">
                        <div className="flex items-center space-x-2">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</span>
                            <span className={`w-12 h-1 bg-gray-200 ${step >= 2 ? 'bg-emerald-600' : ''}`}></span>
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</span>
                            <span className={`w-12 h-1 bg-gray-200 ${step >= 3 ? 'bg-emerald-600' : ''}`}></span>
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}>3</span>
                        </div>
                    </div>

                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                </>
            )}
        </div>
    );
};

export default CivilianReservation;
