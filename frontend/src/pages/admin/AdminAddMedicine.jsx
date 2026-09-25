import React, { useState } from 'react';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AdminAddMedicine = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        medicineName: '',
        genericName: '',
        type: 'TABLET',
        manufacturer: '',
        countryOfManufacture: '',
        registrationNumber: '',
        status: 'ACTIVE',
        description: '',
        dosageForm: '',
        strength: '',
        storageInstructions: '',
        notes: '',
        imageUrl: '' // Placeholder handling
    });

    const MEDICINE_TYPES = [
        'TABLET', 'CAPSULE', 'SYRUP', 'INJECTION', 'CREAM_OINTMENT',
        'DROPS', 'INHALER', 'SUSPENSION', 'OTHER'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8080/api/medicines', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                navigate('/admin/medicines');
            } else {
                alert('Failed to add medicine');
            }
        } catch (error) {
            console.error(error);
            alert('Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link to="/admin/medicines" className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Medicine</h1>
                    <p className="text-sm text-gray-500">Register a new medicine into the national database.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Basic Information</h3>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Medicine Name <span className="text-red-500">*</span></label>
                        <input required name="medicineName" value={formData.medicineName} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none" placeholder="e.g. Panadol" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Generic Name <span className="text-red-500">*</span></label>
                        <input required name="genericName" value={formData.genericName} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none" placeholder="e.g. Paracetamol" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Medicine Type <span className="text-red-500">*</span></label>
                        <select required name="type" value={formData.type} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none bg-white">
                            {MEDICINE_TYPES.map(type => (
                                <option key={type} value={type}>{type.replace('_', ' / ')}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Registration Number <span className="text-red-500">*</span></label>
                        <input required name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none" placeholder="License No." />
                    </div>
                </div>

                <div className="p-6 border-t border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Manufacturer Details</h3>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Manufacturer Name <span className="text-red-500">*</span></label>
                        <input required name="manufacturer" value={formData.manufacturer} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Country of Origin <span className="text-red-500">*</span></label>
                        <input required name="countryOfManufacture" value={formData.countryOfManufacture} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none" />
                    </div>
                </div>

                <div className="p-6 border-t border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Additional Details</h3>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Strength</label>
                            <input name="strength" value={formData.strength} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-lg outline-none" placeholder="e.g. 500mg" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Dosage Form</label>
                            <input name="dosageForm" value={formData.dosageForm} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-lg outline-none" placeholder="e.g. Oval tablet" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Description / Notes</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full p-2.5 border border-gray-200 rounded-lg outline-none" placeholder="Optional description..." />
                    </div>
                </div>

                <div className="p-6 bg-gray-50 flex items-center justify-end gap-3 border-t border-gray-200">
                    <button type="button" onClick={() => navigate('/admin/medicines')} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className="px-6 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors flex items-center gap-2">
                        {loading ? 'Saving...' : <><Save size={18} /> Add Medicine</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminAddMedicine;
