import { useState, useEffect } from 'react'

export default function SystemSettings() {
    const [settings, setSettings] = useState({
        notificationsEnabled: true,
        inventoryAlerts: true,
        expiryAlerts: true,
        systemMessages: true,
        theme: 'Light',
        defaultHomepage: 'Dashboard'
    });
    const [loading, setLoading] = useState(false);

    // Mock loading settings
    useEffect(() => {
        // In a real app, fetch from backend
        // const savedSettings = localStorage.getItem('adminSettings');
        // if (savedSettings) setSettings(JSON.parse(savedSettings));
    }, []);

    const handleSave = () => {
        // Mock save
        // localStorage.setItem('adminSettings', JSON.stringify(settings));
        alert('Settings saved successfully (Local Simulation)');
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">System Settings</h2>

            <div className="max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-semibold mb-6 text-slate-700">Notification Settings</h3>
                    {[
                        { label: 'New Reservations', key: 'notificationsEnabled' },
                        { label: 'Inventory Alerts', key: 'inventoryAlerts' },
                        { label: 'Expiry Alerts', key: 'expiryAlerts' },
                        { label: 'System Messages', key: 'systemMessages' }
                    ].map(({ label, key }) => (
                        <label key={key} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                            <span className="text-slate-600">{label}</span>
                            <input
                                type="checkbox"
                                checked={settings[key]}
                                onChange={(e) => setSettings({ ...settings, [key]: e.target.checked })}
                                className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                            />
                        </label>
                    ))}
                    <button onClick={handleSave} className="mt-8 w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition font-medium">Save Changes</button>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-semibold mb-6 text-slate-700">Display Preferences</h3>
                    <div className="space-y-6">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-600">Theme</label>
                            <select
                                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                value={settings.theme}
                                onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                            >
                                <option value="Light">Light</option>
                                <option value="Dark">Dark</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-600">Default Homepage</label>
                            <select
                                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                value={settings.defaultHomepage}
                                onChange={(e) => setSettings({ ...settings, defaultHomepage: e.target.value })}
                            >
                                <option value="Dashboard">Dashboard</option>
                                <option value="Reservations">Reservations</option>
                            </select>
                        </div>
                    </div>
                    <button onClick={handleSave} className="mt-8 w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition font-medium">Save Preferences</button>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-semibold mb-6 text-slate-700">Data & Privacy</h3>
                    <p className="text-sm text-slate-500 mb-6">Manage your data export and retention policies.</p>
                    <button className="w-full bg-white border border-teal-600 text-teal-600 py-3 rounded-lg mb-4 hover:bg-teal-50 transition font-medium">Export History</button>
                    <button className="w-full border border-red-200 text-red-600 bg-red-50 py-3 rounded-lg hover:bg-red-100 transition font-medium">Clear Notifications</button>
                </div>
            </div>
        </div>
    )
}
