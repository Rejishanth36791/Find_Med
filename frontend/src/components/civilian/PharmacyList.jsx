import React from 'react';
import { MapPin, Pill, Star } from 'lucide-react';

const PharmacyList = ({ pharmacies, onSelect }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-4 h-full overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recommended Pharmacies</h2>

            <div className="space-y-4">
                {pharmacies.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No pharmacies found nearby.</p>
                ) : (
                    pharmacies.map((pharmacy) => (
                        <div
                            key={pharmacy.id}
                            onClick={() => onSelect(pharmacy)}
                            className="border border-gray-100 rounded-xl p-3 hover:shadow-md hover:bg-teal-50 transition cursor-pointer flex justify-between items-start group"
                        >
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 group-hover:text-teal-700">{pharmacy.name}</h3>

                                <div className="flex items-center text-gray-500 text-sm mt-1">
                                    <MapPin size={14} className="mr-1" />
                                    <span>{pharmacy.distance} km away</span>
                                </div>

                                <div className="flex items-center text-gray-500 text-sm mt-1">
                                    <Pill size={14} className="mr-1" />
                                    <span>{pharmacy.available} medicines</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end">
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full flex items-center mb-2">
                                    <Star size={10} className="mr-1 fill-yellow-800" />
                                    {pharmacy.rating || '4.5'}
                                </span>
                                <button className="text-xs bg-teal-600 text-white px-3 py-1.5 rounded-lg hover:bg-teal-700 transition">
                                    Select
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PharmacyList;
