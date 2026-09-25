import React, { useState, useEffect } from 'react';
import {
    ArrowLeft, Edit, Trash2, Power, AlertTriangle, X, Save,
    CheckCircle, Clock, ShieldCheck, Activity
} from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const AdminMedicineDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [medicine, setMedicine] = useState(null);
    const [loading, setLoading] = useState(true);

    // UI States
    const [showUpdatePanel, setShowUpdatePanel] = useState(false);
    const [activeModal, setActiveModal] = useState(null); // 'ACTIVATE', 'DEACTIVATE', 'REMOVE'
    const [actionLoading, setActionLoading] = useState(false);

    // Update Form State
    const [updateForm, setUpdateForm] = useState({});

    useEffect(() => {
        fetchMedicine();
    }, [id]);

    const fetchMedicine = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/medicines/${id}`);
            if (res.ok) {
                const data = await res.json();
                setMedicine(data);
                setUpdateForm(data); // Initialize form
            } else {
                navigate('/admin/medicines');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async () => {
        setActionLoading(true);
        try {
            if (activeModal === 'REMOVE') {
                await fetch(`http://localhost:8080/api/medicines/${id}`, { method: 'DELETE' });
                navigate('/admin/medicines');
            } else {
                const status = activeModal === 'ACTIVATE' ? 'ACTIVE' : 'INACTIVE';
                await fetch(`http://localhost:8080/api/medicines/${id}/status?status=${status}`, { method: 'PATCH' });
                fetchMedicine(); // Refresh
                setActiveModal(null);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/api/medicines/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateForm)
            });
            if (res.ok) {
                fetchMedicine();
                setShowUpdatePanel(false);
            }
        } catch (e) { console.error(e); }
        finally { setActionLoading(false); }
    };

    if (loading) return <div>Loading...</div>;
    if (!medicine) return <div>Not found</div>;

    const StatusBadge = ({ status }) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
            {status}
        </span>
    );

    return (
        <div className="relative min-h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link to="/admin/medicines" className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            {medicine.medicineName}
                            <StatusBadge status={medicine.status} />
                        </h1>
                        <p className="text-sm text-gray-500">{medicine.genericName} • {medicine.type}</p>
                    </div>
                </div>

                {/* Action Buttons (Super Admin) */}
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowUpdatePanel(true)}
                        className="flex items-center gap-2 px-4 py-2 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 font-medium transition-colors"
                    >
                        <Edit size={16} /> Update
                    </button>
                    {medicine.status === 'INACTIVE' ? (
                        <button
                            onClick={() => setActiveModal('ACTIVATE')}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                        >
                            <CheckCircle size={16} /> Activate
                        </button>
                    ) : (
                        <button
                            onClick={() => setActiveModal('DEACTIVATE')}
                            className="flex items-center gap-2 px-4 py-2 border border-yellow-200 text-yellow-700 rounded-lg hover:bg-yellow-50 font-medium transition-colors"
                        >
                            <Power size={16} /> Deactivate
                        </button>
                    )}
                    <button
                        onClick={() => setActiveModal('REMOVE')}
                        className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 font-medium transition-colors"
                    >
                        <Trash2 size={16} /> Remove
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6">Medicine Information</h3>
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Manufacturer</p>
                                <p className="font-medium text-gray-900 mt-1">{medicine.manufacturer}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Country of Origin</p>
                                <p className="font-medium text-gray-900 mt-1">{medicine.countryOfManufacture}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Registration No.</p>
                                <p className="font-medium text-gray-900 mt-1">{medicine.registrationNumber}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Strength</p>
                                <p className="font-medium text-gray-900 mt-1">{medicine.strength || '-'}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-xs text-gray-500 uppercase">Dosage Form</p>
                                <p className="font-medium text-gray-900 mt-1">{medicine.dosageForm || '-'}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-xs text-gray-500 uppercase">Description</p>
                                <p className="text-gray-700 mt-1">{medicine.description || 'No description provided.'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6">Inventory & Usage</h3>
                        <div className="flex items-center justify-center p-8 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            Pharmacy inventory stats placeholder
                        </div>
                    </div>
                </div>

                {/* Side Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Audit Trail</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Clock className="text-gray-400" size={18} />
                                <div>
                                    <p className="text-xs text-gray-500">Registered On</p>
                                    <p className="text-sm font-medium text-gray-900">{new Date(medicine.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Activity className="text-gray-400" size={18} />
                                <div>
                                    <p className="text-xs text-gray-500">Last Updated</p>
                                    <p className="text-sm font-medium text-gray-900">{new Date(medicine.lastUpdated).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Update Side Panel */}
            {showUpdatePanel && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/20" onClick={() => setShowUpdatePanel(false)} />
                    <div className="relative w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-900">Update Medicine</h2>
                            <button onClick={() => setShowUpdatePanel(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>

                        <form id="update-form" onSubmit={handleUpdate} className="p-6 space-y-4 flex-1">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input className="w-full p-2 border rounded-lg" value={updateForm.medicineName} onChange={e => setUpdateForm({ ...updateForm, medicineName: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Generic Name</label>
                                <input className="w-full p-2 border rounded-lg" value={updateForm.genericName} onChange={e => setUpdateForm({ ...updateForm, genericName: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select className="w-full p-2 border rounded-lg" value={updateForm.type} onChange={e => setUpdateForm({ ...updateForm, type: e.target.value })}>
                                    {['TABLET', 'CAPSULE', 'SYRUP', 'INJECTION', 'CREAM_OINTMENT', 'DROPS', 'INHALER', 'SUSPENSION', 'OTHER'].map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                                <input className="w-full p-2 border rounded-lg" value={updateForm.manufacturer} onChange={e => setUpdateForm({ ...updateForm, manufacturer: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea rows="4" className="w-full p-2 border rounded-lg" value={updateForm.description} onChange={e => setUpdateForm({ ...updateForm, description: e.target.value })} />
                            </div>
                            {/* Add other fields as needed */}
                        </form>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <button onClick={() => setShowUpdatePanel(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg">Cancel</button>
                            <button form="update-form" type="submit" className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Modals */}
            {activeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center">
                        <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${activeModal === 'REMOVE' ? 'bg-red-100 text-red-600' :
                            activeModal === 'DEACTIVATE' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                            }`}>
                            {activeModal === 'REMOVE' ? <Trash2 size={24} /> :
                                activeModal === 'DEACTIVATE' ? <Power size={24} /> : <CheckCircle size={24} />}
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {activeModal === 'ACTIVATE' ? 'Activate Medicine?' :
                                activeModal === 'DEACTIVATE' ? 'Deactivate Medicine?' : 'Remove Medicine?'}
                        </h3>

                        <p className="text-sm text-gray-500 mb-6">
                            {activeModal === 'REMOVE' ? 'This will remove the medicine from the registry. This action cannot be undone.' :
                                `Are you sure you want to change the status of "${medicine.medicineName}"?`}
                        </p>

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => setActiveModal(null)}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAction}
                                disabled={actionLoading}
                                className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${activeModal === 'REMOVE' ? 'bg-red-600 hover:bg-red-700' :
                                    activeModal === 'DEACTIVATE' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
                                    }`}
                            >
                                {actionLoading ? 'Processing...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMedicineDetails;
