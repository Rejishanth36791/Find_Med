import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/pharmacy/Layout';
import api from '../../services/api';
import {
    ArrowLeft, Package, DollarSign, Calendar, Info,
    AlertTriangle, CheckCircle, Trash2, Power, Edit
} from 'lucide-react';

export default function MedicineDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [medicine, setMedicine] = useState(null);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [activeModal, setActiveModal] = useState(null); // 'PRICE', 'QUANTITY', 'DEACTIVATE', 'DELETE', 'ACTIVATE'
    const [formData, setFormData] = useState({ price: '', quantity: '' });
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        try {
            const res = await api.get(`/pharmacy/inventory/${id}`);
            if (res.data) {
                const data = res.data;
                setMedicine(data);
                setFormData({ price: data.price, quantity: data.availableQuantity });
            } else {
                navigate('/pharmacy/inventory');
            }
        } catch (error) {
            console.error("Error fetching medicine details:", error);
            navigate('/pharmacy/inventory');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async () => {
        setActionLoading(true);
        try {
            let url = `/pharmacy/inventory/${medicine.inventoryId}`;
            let method = 'patch';
            let params = {};

            switch (activeModal) {
                case 'PRICE':
                    params = { price: formData.price };
                    url += `/price`;
                    break;
                case 'QUANTITY':
                    params = { quantity: formData.quantity };
                    url += `/quantity`;
                    break;
                case 'DEACTIVATE':
                    url += `/deactivate`;
                    break;
                case 'ACTIVATE':
                    url += `/activate`;
                    break;
                case 'DELETE':
                    method = 'delete';
                    break;
                default:
                    return;
            }

            const res = await api({ method, url, params });
            if (res.status === 200 || res.status === 204) {
                if (activeModal === 'DELETE') {
                    navigate('/pharmacy/inventory');
                } else {
                    await fetchDetails();
                    setActiveModal(null);
                }
            } else {
                alert("Action failed. Please try again.");
            }
        } catch (error) {
            console.error("Error performing action:", error);
            alert(error.response?.data?.message || "An error occurred.");
        } finally {
            setLoading(false); // Should be setActionLoading(false)? Fixed in next step or now
            setActionLoading(false);
        }
    };

    if (loading) return <Layout title="Medicine Details"><div className="p-20 text-center text-xl italic text-gray-400">Loading details...</div></Layout>;
    if (!medicine) return <Layout title="Not Found"><div className="p-20 text-center text-xl text-red-500">Medicine not found.</div></Layout>;

    return (
        <Layout title={`Managing: ${medicine.medicineName}`}>
            <div className="max-w-7xl mx-auto space-y-8 pb-20">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <button onClick={() => navigate('/pharmacy/inventory')} className="flex items-center gap-2 text-primary font-bold hover:underline">
                        <ArrowLeft size={20} /> Back to Inventory
                    </button>
                    <div className="flex gap-2">
                        <span className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest ${medicine.approvalStatus === 'APPROVED' ? 'bg-green-100 text-green-700' :
                            medicine.approvalStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {medicine.approvalStatus}
                        </span>
                        <span className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest ${medicine.status === 'In Stock' ? 'bg-green-100 text-green-700' :
                            medicine.status === 'Low Stock' ? 'bg-orange-100 text-orange-700' :
                                medicine.status === 'Out of Stock' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                            {medicine.status}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Image & Quick Actions */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                            {medicine.imageUrl ? (
                                <img src={medicine.imageUrl} alt={medicine.medicineName} className="w-full aspect-square object-cover" />
                            ) : (
                                <div className="w-full aspect-square bg-gray-50 flex flex-col items-center justify-center text-gray-300 gap-4">
                                    <Package size={80} />
                                    <span className="font-bold">No Image Available</span>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-4">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Stock Management</h3>
                            <button
                                onClick={() => setActiveModal('PRICE')}
                                className="w-full flex items-center justify-between p-4 rounded-2xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all group"
                            >
                                <div className="flex items-center gap-3 font-bold">
                                    <DollarSign size={20} /> Update Price
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveModal('QUANTITY')}
                                className="w-full flex items-center justify-between p-4 rounded-2xl bg-green-50 text-green-700 hover:bg-green-100 transition-all group"
                            >
                                <div className="flex items-center gap-3 font-bold">
                                    <Package size={20} /> Update Quantity
                                </div>
                            </button>

                            <hr className="my-6 border-gray-50" />

                            {medicine.status === 'Deactivated' ? (
                                <button
                                    onClick={() => setActiveModal('ACTIVATE')}
                                    className="w-full flex items-center justify-center p-4 rounded-2xl bg-primary text-white hover:shadow-lg transition-all font-bold gap-2"
                                >
                                    <Power size={20} /> Activate Medicine
                                </button>
                            ) : (
                                <button
                                    onClick={() => setActiveModal('DEACTIVATE')}
                                    className="w-full flex items-center justify-center p-4 rounded-2xl border-2 border-orange-200 text-orange-600 hover:bg-orange-50 transition-all font-bold gap-2"
                                >
                                    <Power size={20} /> Deactivate
                                </button>
                            )}
                            <button
                                onClick={() => setActiveModal('DELETE')}
                                className="w-full flex items-center justify-center p-4 rounded-2xl border-2 border-red-100 text-red-500 hover:bg-red-50 transition-all font-bold gap-2"
                            >
                                <Trash2 size={20} /> Delete from Inventory
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Full Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10">
                            <div className="mb-10">
                                <h1 className="text-4xl font-black text-gray-900 mb-2">{medicine.medicineName}</h1>
                                <p className="text-xl text-gray-500">{medicine.genericName}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                                <InfoItem label="Dosage Form" value={medicine.dosageForm} />
                                <InfoItem label="Strength" value={medicine.strength} />
                                <InfoItem label="Manufacturer" value={medicine.manufacturer} />
                                <InfoItem label="Prescription Required" value={medicine.requiresPrescription ? 'YES' : 'NO'} />
                                <div className="col-span-2">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Active Ingredients</p>
                                    <div className="flex flex-wrap gap-2">
                                        {medicine.activeIngredients ? medicine.activeIngredients.split(',').map(tag => (
                                            <span key={tag} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-600">
                                                {tag.trim()}
                                            </span>
                                        )) : <span className="text-gray-400 italic">Not specified</span>}
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Description</p>
                                    <p className="text-gray-600 leading-relaxed">{medicine.description || 'No detailed description available.'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Batch Table */}
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="text-xl font-bold text-gray-800">Batch & Expiry Info</h3>
                            </div>
                            <table className="w-full">
                                <thead className="bg-gray-50/30">
                                    <tr>
                                        <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Batch Number</th>
                                        <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Quantity</th>
                                        <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Expiry Date</th>
                                        <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    <tr>
                                        <td className="px-8 py-6 font-bold text-gray-700">{medicine.batchNumber || 'N/A'}</td>
                                        <td className="px-8 py-6 font-bold text-gray-900">{medicine.availableQuantity}</td>
                                        <td className="px-8 py-6 text-gray-600">{medicine.expiryDate ? new Date(medicine.expiryDate).toLocaleDateString() : 'N/A'}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${medicine.status === 'In Stock' ? 'text-green-600 bg-green-50' :
                                                medicine.status === 'Low Stock' ? 'text-orange-600 bg-orange-50' : 'text-red-600 bg-red-50'
                                                }`}>
                                                {medicine.status}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {activeModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => !actionLoading && setActiveModal(null)} />
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 overflow-hidden">

                        <div className="flex flex-col items-center text-center gap-6">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${activeModal === 'DELETE' ? 'bg-red-100 text-red-600' :
                                activeModal === 'DEACTIVATE' ? 'bg-orange-100 text-orange-600' : 'bg-primary/10 text-primary'
                                }`}>
                                {activeModal === 'PRICE' && <DollarSign size={40} />}
                                {activeModal === 'QUANTITY' && <Package size={40} />}
                                {activeModal === 'DEACTIVATE' && <Power size={40} />}
                                {activeModal === 'DELETE' && <Trash2 size={40} />}
                                {activeModal === 'ACTIVATE' && <CheckCircle size={40} />}
                            </div>

                            <div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                                    {activeModal === 'PRICE' && 'Update Price'}
                                    {activeModal === 'QUANTITY' && 'Update Quantity'}
                                    {activeModal === 'DEACTIVATE' && 'Deactivate Medicine?'}
                                    {activeModal === 'DELETE' && 'Permanently Delete?'}
                                    {activeModal === 'ACTIVATE' && 'Activate Medicine?'}
                                </h3>
                                <p className="text-gray-500 mt-2">
                                    {activeModal === 'PRICE' && 'Change the selling price for this medicine.'}
                                    {activeModal === 'QUANTITY' && 'Add or remove stock from your inventory.'}
                                    {activeModal === 'DEACTIVATE' && 'This will move the medicine to the deactivated list.'}
                                    {activeModal === 'DELETE' && 'This action cannot be undone and will remove all stock info.'}
                                    {activeModal === 'ACTIVATE' && 'This will return the medicine to your active inventory.'}
                                </p>
                            </div>

                            {(activeModal === 'PRICE' || activeModal === 'QUANTITY') && (
                                <div className="w-full space-y-4">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:outline-none text-xl font-bold"
                                            value={activeModal === 'PRICE' ? formData.price : formData.quantity}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                [activeModal === 'PRICE' ? 'price' : 'quantity']: e.target.value
                                            })}
                                        />
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold uppercase tracking-widest text-xs">
                                            {activeModal === 'PRICE' ? 'LKR' : 'Units'}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4 w-full pt-4">
                                <button
                                    onClick={() => setActiveModal(null)}
                                    disabled={actionLoading}
                                    className="flex-1 px-8 py-4 rounded-2xl border-2 border-gray-100 font-bold text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleAction()}
                                    disabled={actionLoading}
                                    className={`flex-1 px-8 py-4 rounded-2xl font-bold text-white transition-all shadow-lg hover:-translate-y-0.5 disabled:opacity-50 ${activeModal === 'DELETE' ? 'bg-red-600 shadow-red-200' : 'bg-primary shadow-primary/30'
                                        }`}
                                >
                                    {actionLoading ? 'Saving...' : 'Confirm'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

function InfoItem({ label, value }) {
    return (
        <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-lg font-bold text-gray-800">{value || '-'}</p>
        </div>
    );
}
