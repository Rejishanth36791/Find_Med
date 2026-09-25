import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/pharmacy/Layout';
import api from '../../services/api';
import { ArrowLeft, Save, Pill, Building, Ruler, Info, DollarSign, Package, Calendar } from 'lucide-react';

export default function AddMedicine() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        medicineName: '',
        genericName: '',
        activeIngredients: '',
        manufacturer: '',
        dosageForm: 'Tablet',
        strength: '',
        requiresPrescription: false,
        stockQuantity: '',
        price: '',
        imageUrl: '',
        expiryDate: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/pharmacy/inventory', {
                ...formData,
                stockQuantity: parseInt(formData.stockQuantity),
                price: parseFloat(formData.price)
            });

            if (response.status === 200 || response.status === 201) {
                alert('Medicine added successfully!');
                navigate('/pharmacy/inventory');
            } else {
                alert('Failed to add medicine. Please check your inputs.');
            }
        } catch (error) {
            console.error('Error adding medicine:', error);
            alert('An error occurred while communicating with the server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Add New Medicine">
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                <button
                    onClick={() => navigate('/pharmacy/inventory')}
                    className="flex items-center gap-2 text-primary font-bold hover:underline"
                >
                    <ArrowLeft size={20} /> Back to Inventory
                </button>

                <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                        <h2 className="text-2xl font-bold text-gray-800">Medicine Specifications</h2>
                        <p className="text-sm text-gray-500">Provide details about the medicine and initial stock levels.</p>
                    </div>

                    <div className="p-10 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FormItem label="Medicine Trade Name" icon={Pill}>
                                <input
                                    type="text" name="medicineName" required
                                    value={formData.medicineName} onChange={handleChange}
                                    placeholder="e.g. Panadol"
                                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition"
                                />
                            </FormItem>

                            <FormItem label="Generic Name" icon={Info}>
                                <input
                                    type="text" name="genericName" required
                                    value={formData.genericName} onChange={handleChange}
                                    placeholder="e.g. Paracetamol"
                                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition"
                                />
                            </FormItem>

                            <FormItem label="Manufacturer" icon={Building}>
                                <input
                                    type="text" name="manufacturer" required
                                    value={formData.manufacturer} onChange={handleChange}
                                    placeholder="e.g. GSK"
                                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition"
                                />
                            </FormItem>

                            <FormItem label="Active Ingredients" icon={Info}>
                                <input
                                    type="text" name="activeIngredients"
                                    value={formData.activeIngredients} onChange={handleChange}
                                    placeholder="e.g. Paracetamol 500mg"
                                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition"
                                />
                            </FormItem>

                            <FormItem label="Dosage Form" icon={Ruler}>
                                <select
                                    name="dosageForm"
                                    value={formData.dosageForm} onChange={handleChange}
                                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition bg-white"
                                >
                                    <option>Tablet</option>
                                    <option>Capsule</option>
                                    <option>Syrup</option>
                                    <option>Injection</option>
                                    <option>Ointment</option>
                                    <option>Inhaler</option>
                                </select>
                            </FormItem>

                            <FormItem label="Strength" icon={Ruler}>
                                <input
                                    type="text" name="strength" required
                                    value={formData.strength} onChange={handleChange}
                                    placeholder="e.g. 500mg"
                                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition"
                                />
                            </FormItem>
                        </div>

                        <div className="bg-teal-50/50 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border border-teal-100/50">
                            <FormItem label="Available Stock Quantity" icon={Package}>
                                <input
                                    type="number" name="stockQuantity" required
                                    value={formData.stockQuantity} onChange={handleChange}
                                    placeholder="0"
                                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition"
                                />
                            </FormItem>

                            <FormItem label="Unit Price (LKR)" icon={DollarSign}>
                                <input
                                    type="number" step="0.01" name="price" required
                                    value={formData.price} onChange={handleChange}
                                    placeholder="0.00"
                                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition"
                                />
                            </FormItem>

                            <FormItem label="Batch Expiry Date" icon={Calendar}>
                                <input
                                    type="date" name="expiryDate" required
                                    value={formData.expiryDate} onChange={handleChange}
                                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition"
                                />
                            </FormItem>

                            <div className="flex items-center gap-3 md:mt-8 px-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox" name="requiresPrescription"
                                        checked={formData.requiresPrescription} onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    <span className="ms-3 text-sm font-bold text-gray-700 uppercase tracking-tight">Requires Prescription</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6">
                            <button
                                type="button"
                                onClick={() => navigate('/pharmacy/inventory')}
                                className="flex-1 py-4 px-8 rounded-2xl border-2 border-gray-100 font-bold text-gray-500 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-4 px-8 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
                            >
                                <Save size={20} />
                                {loading ? 'Adding to Inventory...' : 'Add Medicine'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
}

function FormItem({ label, icon: Icon, children }) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                <Icon size={14} className="text-primary" />
                {label}
            </label>
            {children}
        </div>
    );
}
