import React, { useState } from 'react';
import { Search, MapPin, Phone, Info, ShoppingCart, MessageSquare, AlertCircle } from 'lucide-react';

const CivilianDrugDictionary = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm) return;

        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/api/civilian/medicine/search?name=${searchTerm}`);
            const data = await res.json();
            setSearchResult(data);
        } catch (err) {
            console.error("Search failed:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Search Bar Section */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="Search by Medicine Name (e.g., Paracetamol)..."
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[#2FA4A9] font-bold text-slate-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#2FA4A9] text-white px-6 py-2 rounded-xl font-black text-sm hover:bg-[#258d91] transition-all">
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </form>
                </div>

                {!searchResult && !loading && (
                    <div className="text-center py-20 opacity-40">
                        <Info size={64} className="mx-auto mb-4" />
                        <p className="text-xl font-black">Search for a medicine to see details and availability.</p>
                    </div>
                )}

                {searchResult && searchResult.medicineFound ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Panel: Medicine Details (Registry Data) */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-28">
                                <span className="bg-teal-50 text-[#2FA4A9] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    {searchResult.medicineDetails.type}
                                </span>
                                <h2 className="text-3xl font-black text-slate-800 mt-4">{searchResult.medicineDetails.medicineName}</h2>
                                <p className="text-slate-400 font-bold mb-6 italic">{searchResult.medicineDetails.genericName}</p>

                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Usage</p>
                                        <p className="text-sm font-bold text-slate-600">{searchResult.medicineDetails.usage}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Dosage</p>
                                            <p className="text-sm font-bold text-slate-600">{searchResult.medicineDetails.dosageForm} {searchResult.medicineDetails.strength}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Prescription</p>
                                            <p className={`text-sm font-bold ${searchResult.medicineDetails.requiresPrescription ? 'text-red-500' : 'text-green-500'}`}>
                                                {searchResult.medicineDetails.requiresPrescription ? 'Required' : 'Not Required'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t border-slate-50">
                                        <p className="text-[10px] font-black text-red-300 uppercase tracking-widest mb-1">Precautions</p>
                                        <p className="text-xs font-bold text-slate-500 leading-relaxed">{searchResult.medicineDetails.precautions}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel: Recommended Pharmacies (Inventory Data) */}
                        <div className="lg:col-span-2 space-y-6">
                            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                Recommended Pharmacies <span className="text-sm bg-slate-200 px-3 py-1 rounded-full">{searchResult.availablePharmacies.length}</span>
                            </h3>

                            {searchResult.availablePharmacies.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {searchResult.availablePharmacies.map((pharmacy) => (
                                        <div key={pharmacy.pharmacyId} className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-[#2FA4A9] transition-all group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="font-black text-slate-800 group-hover:text-[#2FA4A9] transition-colors">{pharmacy.pharmacyName}</h4>
                                                    <div className="flex items-center gap-1 text-slate-400 text-xs font-bold mt-1">
                                                        <MapPin size={12} /> {pharmacy.city}
                                                    </div>
                                                </div>
                                                <span className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">
                                                    In Stock: {pharmacy.availableQuantity}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold mb-6">
                                                <Phone size={12} /> {pharmacy.contact}
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <button className="flex items-center justify-center gap-2 bg-[#2FA4A9] text-white py-3 rounded-xl font-black text-[10px] uppercase hover:bg-[#258d91] transition-all shadow-lg shadow-[#2FA4A9]/20">
                                                    <ShoppingCart size={14} /> Reserve
                                                </button>
                                                <button className="flex items-center justify-center gap-2 bg-slate-50 text-slate-600 py-3 rounded-xl font-black text-[10px] uppercase hover:bg-slate-100 transition-all">
                                                    <MessageSquare size={14} /> Contact
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-orange-50 p-10 rounded-[2.5rem] border border-orange-100 text-center">
                                    <AlertCircle size={40} className="mx-auto mb-4 text-orange-400" />
                                    <p className="text-orange-800 font-black">Currently unavailable in registered pharmacies.</p>
                                    <p className="text-orange-600/70 text-sm font-bold mt-2">Try checking back later or contact support.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    searchResult && !searchResult.medicineFound && (
                        <div className="bg-white p-20 rounded-[3rem] border border-slate-100 text-center shadow-sm">
                            <h2 className="text-2xl font-black text-slate-800">Medicine Not Found</h2>
                            <p className="text-slate-400 font-bold mt-2">Please check the spelling or try searching for a generic name.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default CivilianDrugDictionary;