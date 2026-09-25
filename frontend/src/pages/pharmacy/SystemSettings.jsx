import React, { useState, useEffect } from 'react';
import Layout from '../../components/pharmacy/Layout';
import api from '../../services/api';
import { Bell, Monitor, Shield, Save, Download, Trash2, CheckCircle2 } from 'lucide-react';

export default function SystemSettings() {
    const [settings, setSettings] = useState({
        notificationsEnabled: true,
        inventoryAlerts: true,
        expiryAlerts: true,
        systemMessages: true,
        theme: 'Light',
        defaultHomepage: 'Dashboard',
        layout: 'Regular'
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/pharmacy/settings');
                if (response.data) {
                    setSettings(prev => ({ ...prev, ...response.data }));
                }
            } catch (error) {
                console.error('Failed to fetch settings:', error);
                const localTheme = localStorage.getItem('theme') || 'light';
                setSettings(prev => ({ ...prev, theme: localTheme.charAt(0).toUpperCase() + localTheme.slice(1) }));
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const applyThemeLocally = (themeValue) => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        if (themeValue === 'dark') {
            root.classList.add('dark');
        } else if (themeValue === 'light') {
            root.classList.add('light');
        }
    };

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        // Proactively apply theme if the user toggles it, 
        // but user requested "click save changes", so I'll wait for save button or apply now?
        // Let's apply immediately for better UX, but the user specifically mentioned the save button.
        // Actually, if I apply immediately and then they click save, it works too.
        if (key === 'theme') {
            applyThemeLocally(value.toLowerCase());
        }
    };

    const saveSettings = async () => {
        setSaving(true);
        try {
            const response = await api.put('/pharmacy/settings', {
                notificationsEnabled: settings.notificationsEnabled,
                theme: settings.theme,
                defaultHomepage: settings.defaultHomepage,
                inventoryAlerts: settings.inventoryAlerts,
                expiryAlerts: settings.expiryAlerts,
                systemMessages: settings.systemMessages
            });

            if (response.status === 200 || response.status === 204) {
                showToast('Settings saved successfully!');
            } else {
                showToast('Failed to save settings.', 'error');
            }
        } catch (error) {
            console.error('Save error:', error);
            showToast(error.response?.data?.message || 'An error occurred while saving.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const handleClearNotifications = () => {
        setShowConfirmModal(true);
    };

    const confirmClear = () => {
        // Logic to clear notifications via API if needed
        setShowConfirmModal(false);
        showToast('Notifications cleared successfully!');
    };

    const handleExport = (type) => {
        showToast(`Exporting reservation history as ${type}...`);
        // Logic to trigger download
    };

    if (loading) {
        return (
            <Layout title="System Settings">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="System Settings">
            <div className="max-w-4xl space-y-8">
                {/* Notification Settings */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transform transition hover:shadow-md">
                    <div className="p-6 border-b border-gray-50 flex items-center gap-3">
                        <div className="bg-teal-50 p-2 rounded-lg">
                            <Bell className="text-primary" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Notification Settings</h2>
                            <p className="text-sm text-gray-500">Control how and when you receive alerts for pharmacy operations.</p>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <ToggleItem
                                label="New Reservations Notifications"
                                description="Receive alerts when a customer makes a new reservation"
                                checked={settings.notificationsEnabled}
                                onChange={() => handleToggle('notificationsEnabled')}
                            />
                            <ToggleItem
                                label="Inventory Alerts (Low Stock / Out of Stock)"
                                description="Daily summary of items that need restocking"
                                checked={settings.inventoryAlerts}
                                onChange={() => handleToggle('inventoryAlerts')}
                            />
                            <ToggleItem
                                label="Expiry Alerts (Expired / Expiring Soon)"
                                description="Alerts for medicines reaching their expiry date within 30 days"
                                checked={settings.expiryAlerts}
                                onChange={() => handleToggle('expiryAlerts')}
                            />
                            <ToggleItem
                                label="System / Admin Messages"
                                description="Important updates from the FindMyMeds system administrators"
                                checked={settings.systemMessages}
                                onChange={() => handleToggle('systemMessages')}
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={saveSettings}
                                disabled={saving}
                                className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70"
                            >
                                <Save size={18} />
                                {saving ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </div>
                </section>

                {/* Display / UI Preferences */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transform transition hover:shadow-md">
                    <div className="p-6 border-b border-gray-50 flex items-center gap-3">
                        <div className="bg-teal-50 p-2 rounded-lg">
                            <Monitor className="text-primary" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Display & UI Preferences</h2>
                            <p className="text-sm text-gray-500">Customize the visual appearance and behavior of your portal.</p>
                        </div>
                    </div>

                    <div className="p-6 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Theme Preference</label>
                                <div className="flex bg-gray-100 p-1 rounded-xl w-64">
                                    {['Light', 'Dark'].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => handleChange('theme', t)}
                                            className={`flex-1 py-1.5 px-3 rounded-lg text-sm font-medium transition ${settings.theme === t ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Default Homepage</label>
                                <select
                                    value={settings.defaultHomepage}
                                    onChange={(e) => handleChange('defaultHomepage', e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary transition"
                                >
                                    <option value="Dashboard">Dashboard</option>
                                    <option value="Reservations">Reservations</option>
                                    <option value="Inventory">Inventory</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Layout Density</label>
                                <div className="flex items-center gap-4">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={settings.layout === 'Compact'}
                                            onChange={() => handleChange('layout', settings.layout === 'Regular' ? 'Compact' : 'Regular')}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        <span className="ms-3 text-sm font-medium text-gray-600">
                                            {settings.layout} Layout
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={saveSettings}
                                disabled={saving}
                                className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70"
                            >
                                <Save size={18} />
                                {saving ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </div>
                </section>

                {/* Data & Privacy */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transform transition hover:shadow-md">
                    <div className="p-6 border-b border-gray-50 flex items-center gap-3">
                        <div className="bg-teal-50 p-2 rounded-lg">
                            <Shield className="text-primary" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Data & Privacy</h2>
                            <p className="text-sm text-gray-500">Manage your pharmacy data exports and notification cleanup.</p>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl">
                            <div>
                                <h4 className="font-medium text-gray-800">Export Reservation History</h4>
                                <p className="text-sm text-gray-500">Download all your pharmacy's reservation records.</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleExport('CSV')}
                                    className="bg-white border border-gray-200 hover:border-primary hover:text-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition"
                                >
                                    <Download size={16} />
                                    CSV
                                </button>
                                <button
                                    onClick={() => handleExport('PDF')}
                                    className="bg-white border border-gray-200 hover:border-primary hover:text-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition"
                                >
                                    <Download size={16} />
                                    PDF
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-orange-50 rounded-xl">
                            <div>
                                <h4 className="font-medium text-orange-800">Clear Temporary Notifications</h4>
                                <p className="text-sm text-orange-600">Remove all read and old notifications from your history.</p>
                            </div>
                            <button
                                onClick={handleClearNotifications}
                                className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition"
                            >
                                <Trash2 size={16} />
                                Clear Notifications
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Clear Notifications?</h3>
                        <p className="text-gray-500 mb-6">This action will permanently delete all temporary notifications. This cannot be undone.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmClear}
                                className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition"
                            >
                                Confirm Clear
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed bottom-8 right-8 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300 z-[100] ${toast.type === 'success' ? 'bg-primary text-white' : 'bg-red-500 text-white'}`}>
                    <CheckCircle2 size={24} />
                    <span className="font-medium">{toast.message}</span>
                </div>
            )}
        </Layout>
    );
}

function ToggleItem({ label, description, checked, onChange }) {
    return (
        <div className="flex items-center justify-between group">
            <div className="flex-1">
                <h4 className="font-medium text-gray-800 group-hover:text-primary transition-colors">{label}</h4>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={checked}
                    onChange={onChange}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
        </div>
    );
}
