import React, { useState, useEffect } from 'react';
import { Search, MapPin, Navigation } from 'lucide-react';
import { searchPharmacies, getNearbyPharmacies } from '../../API/civilianApi';

const FindPharmacy = () => {
    const [query, setQuery] = useState('');
    const [pharmacies, setPharmacies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [location, setLocation] = useState(null);

    useEffect(() => {
        // Load initial pharmacies
        handleSearch();
    }, []);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`http://localhost:8080/api/pharmacies/nearby?lat=${lat}&lng=${lng}&radius=15`);
            if (response.ok) {
                const data = await response.json();
                setPharmacies(data);
            }
        } catch (error) {
            console.error("Error fetching pharmacies", error);
        } finally {
            setLoading(false);
        }
    };

    const handleNearMe = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    setLocation({ lat: latitude, lng: longitude });
                    const data = await getNearbyPharmacies(latitude, longitude);
                    setPharmacies(data);
                } catch (err) {
                    console.error("Failed to fetch nearby pharmacies", err);
                    setError('Failed to find nearby pharmacies.');
                } finally {
                    setLoading(false);
                }
            },
            () => {
                setError('Unable to retrieve your location');
                setLoading(false);
            }
        );
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Find a Pharmacy</h1>
                <p className="text-gray-500 mt-2">Search for pharmacies near you or by name</p>
            </header>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by pharmacy name..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <button
                    onClick={handleSearch}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-medium transition-colors w-full md:w-auto"
                >
                    Search
                </button>
                <button
                    onClick={handleNearMe}
                    className="flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-6 py-3 rounded-xl font-medium transition-colors w-full md:w-auto justify-center"
                >
                    <Navigation size={18} />
                    Near Me
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
                    {error}
                </div>
            )}

            {/* Results Grid */}
            {loading ? (
                <div className="text-center py-12 text-gray-400">Loading pharmacies...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pharmacies.length > 0 ? (
                        pharmacies.map((pharmacy) => (
                            <div key={pharmacy.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                                        <MapPin size={24} />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${pharmacy.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {pharmacy.status}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{pharmacy.name}</h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{pharmacy.address}</p>
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                                    <button className="text-teal-600 font-medium text-sm hover:underline">View Details</button>
                                    <span className="text-xs text-gray-400">
                                        {pharmacy.distance ? `${pharmacy.distance.toFixed(1)} km away` : ''}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100 border-dashed">
                            No pharmacies found. Try a different search term.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FindPharmacy;
