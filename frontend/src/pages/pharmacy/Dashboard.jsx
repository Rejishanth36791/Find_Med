import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/pharmacy/Layout'
import api from '../../services/api'
import {
    Package, CheckCircle, XCircle, Pill, TrendingUp,
    ArrowUpRight, ArrowDownRight, Zap, Bell, Clock, Plus, Settings, MessageSquare, History,
    FileText, User, ChevronRight, Activity, AlertCircle
} from 'lucide-react'

export default function Dashboard() {
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState({
        todaysReservations: 0,
        pendingOrders: 0,
        completedToday: 0,
        rejectedToday: 0,
        totalRevenue: 0,
        outOfStock: 0,
        expiringSoon: 0,
        inStock: 0,
        lowStock: 0,
        totalMedicines: 0
    });
    const [stockHealth, setStockHealth] = useState({ healthy: 0, lowStock: 0, critical: 0, outOfStock: 0 });
    const [activities, setActivities] = useState([]);
    const [aiInsights, setAiInsights] = useState({ topMedicine: '', demandForecast: '', suggestion: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const metricsRes = await api.get('/pharmacy/dashboard/metrics');
                if (metricsRes.data) {
                    const data = metricsRes.data;
                    setMetrics({
                        todaysReservations: data.todaysReservations || 0,
                        pendingOrders: data.pendingOrders || 0,
                        completedToday: data.completedToday || 0,
                        rejectedToday: data.rejectedToday || 0,
                        totalRevenue: data.totalRevenue || 0,
                        outOfStock: data.outOfStock || 0,
                        expiringSoon: data.expiringSoon || 0,
                        inStock: data.inStockMedicines || 0,
                        lowStock: data.lowStock || 0,
                        totalMedicines: data.totalMedicines || 0
                    });
                }

                // Fetch inventory metrics for stock health calculation
                const inventoryRes = await api.get('/pharmacy/inventory/metrics');
                if (inventoryRes.data) {
                    const invData = inventoryRes.data;
                    const total = invData.totalMedicines || 1;
                    const healthyCount = invData.inStock || 0;
                    const lowCount = invData.lowStock || 0;
                    const outCount = invData.outOfStock || 0;
                    const healthyPercent = Math.round((healthyCount / total) * 100);
                    const lowPercent = Math.round((lowCount / total) * 100);
                    const outPercent = Math.round((outCount / total) * 100);
                    setStockHealth({ healthy: healthyPercent, lowStock: lowPercent, critical: lowPercent, outOfStock: outPercent });
                }

                // Fetch recent activities
                try {
                    const activitiesRes = await api.get('/pharmacy/activities/recent');
                    if (activitiesRes.data) {
                        setActivities(activitiesRes.data.slice(0, 3));
                    }
                } catch (e) {
                    console.log('Activities endpoint not available');
                }

            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <Layout title="Dashboard Overview">
            <div className="space-y-8 animate-in fade-in duration-700">
                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <StatusCard
                        title="Today's Reservations"
                        value={metrics.todaysReservations}
                        trend="+12%"
                        icon={Package}
                        isPrimary
                        onClick={() => navigate('/pharmacy/current-reservations')}
                    />
                    <StatusCard
                        title="Pending Orders"
                        value={metrics.pendingOrders}
                        trend="-5%"
                        icon={Clock}
                        onClick={() => navigate('/pharmacy/current-reservations')}
                    />
                    <StatusCard
                        title="Completed Orders"
                        value={metrics.completedToday}
                        trend="+18%"
                        icon={CheckCircle}
                        onClick={() => navigate('/pharmacy/reservation-history')}
                    />
                    <StatusCard
                        title="Rejected Orders"
                        value={metrics.rejectedToday}
                        trend="-2%"
                        icon={XCircle}
                        isNegative
                        onClick={() => navigate('/pharmacy/reservation-history')}
                    />
                    <StatusCard
                        title="Total Revenue"
                        value={`LKR ${metrics.totalRevenue.toLocaleString()}`}
                        trend="+5%"
                        icon={TrendingUp}
                        onClick={() => navigate('/pharmacy/reports')}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* AI Insights & Quick Action Launcher Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Smart AI Insights */}
                        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl">
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h3 className="text-2xl font-bold flex items-center gap-2">
                                            <Zap className="fill-yellow-400 text-yellow-400" size={24} />
                                            Smart AI Insights
                                        </h3>
                                        <p className="text-white/80 mt-1">AI-driven highlights for your pharmacy today</p>
                                    </div>
                                    <button className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition" onClick={() => navigate('/pharmacy/notifications')}>
                                        <AlertCircle size={20} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <AIHighlight
                                        label="Low Stock Items"
                                        value={`${metrics.lowStock || 0} items`}
                                        detail="Need restocking soon"
                                        onClick={() => navigate('/pharmacy/inventory')}
                                    />
                                    <AIHighlight
                                        label="Out of Stock"
                                        value={`${metrics.outOfStock || 0} items`}
                                        detail="Require immediate attention"
                                        onClick={() => navigate('/pharmacy/inventory')}
                                    />
                                    <AIHighlight
                                        label="Expiring Soon"
                                        value={`${metrics.expiringSoon || 0} items`}
                                        detail="Within next 30 days"
                                        onClick={() => navigate('/pharmacy/inventory')}
                                    />
                                </div>
                            </div>
                            {/* Decorative blur elements */}
                            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
                        </div>

                        {/* Quick Action Launcher */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Action Launcher</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <QuickActionButton
                                    icon={Plus}
                                    label="Add New Medicine"
                                    color="text-teal-600"
                                    bg="bg-teal-50"
                                    onClick={() => navigate('/pharmacy/inventory/add')}
                                />
                                <QuickActionButton
                                    icon={Activity}
                                    label="Update Price"
                                    color="text-blue-600"
                                    bg="bg-blue-50"
                                    onClick={() => navigate('/pharmacy/inventory')}
                                />
                                <QuickActionButton
                                    icon={Package}
                                    label="Manage Inventory"
                                    color="text-indigo-600"
                                    bg="bg-indigo-50"
                                    onClick={() => navigate('/pharmacy/inventory')}
                                />
                                <QuickActionButton
                                    icon={FileText}
                                    label="View Reservations"
                                    color="text-orange-600"
                                    bg="bg-orange-50"
                                    onClick={() => navigate('/pharmacy/current-reservations')}
                                />
                                <QuickActionButton
                                    icon={TrendingUp}
                                    label="Analytic Reports"
                                    color="text-purple-600"
                                    bg="bg-purple-50"
                                    onClick={() => navigate('/pharmacy/reports')}
                                />
                                <QuickActionButton
                                    icon={MessageSquare}
                                    label="Check Inquiries"
                                    color="text-pink-600"
                                    bg="bg-pink-50"
                                    onClick={() => navigate('/pharmacy/admin-center')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stock Health & Activity Column */}
                    <div className="space-y-6">
                        {/* Stock Health Overview */}
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition" onClick={() => navigate('/pharmacy/inventory')}>
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Stock Health Overview</h3>
                            <div className="flex items-center justify-center h-48 relative mb-4">
                                {/* Dynamic Donut Chart */}
                                <div className="w-32 h-32 rounded-full border-[12px] border-gray-100 flex items-center justify-center relative">
                                    <div className="absolute inset-[-12px] rounded-full border-[12px] border-teal-500 border-r-transparent border-b-transparent rotate-45"></div>
                                    <div className="absolute inset-[-12px] rounded-full border-[12px] border-orange-400 border-l-transparent border-t-transparent -rotate-12"></div>
                                    <div className="text-center">
                                        <span className="text-2xl font-bold">{stockHealth.healthy || 0}%</span>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Healthy</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 px-2">
                                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-teal-500"></div> In Stock ({stockHealth.healthy}%)</div>
                                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-400"></div> Low ({stockHealth.lowStock}%)</div>
                                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-200"></div> Out ({stockHealth.outOfStock}%)</div>
                            </div>
                        </div>

                        {/* Realtime Activity Feed */}
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex-1 hover:shadow-md transition cursor-default">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Realtime Activity Feed</h3>
                            <div className="space-y-4">
                                {activities.length > 0 ? (
                                    activities.map((activity, idx) => (
                                        <ActivityItem
                                            key={idx}
                                            user={activity.userName || 'System'}
                                            action={activity.action || 'Activity recorded'}
                                            detail={activity.detail}
                                            time={activity.timeAgo || 'Just now'}
                                            iconColor={activity.type === 'reservation' ? 'bg-blue-500' : activity.type === 'inventory' ? 'bg-teal-500' : 'bg-purple-500'}
                                            onClick={() => navigate(activity.link || '/pharmacy/dashboard')}
                                        />
                                    ))
                                ) : (
                                    <>
                                        <ActivityItem user="Pending" action="pending reservations" detail={`${metrics.pendingOrders} `} time="Now" iconColor="bg-blue-500" onClick={() => navigate('/pharmacy/current-reservations')} />
                                        <ActivityItem user="Low Stock" action="items need attention" detail={`${metrics.lowStock} `} time="Current" iconColor="bg-orange-500" onClick={() => navigate('/pharmacy/inventory')} />
                                        <ActivityItem user="Expiring" action="medicines expiring soon" detail={`${metrics.expiringSoon} `} time="30 days" iconColor="bg-red-500" onClick={() => navigate('/pharmacy/inventory')} />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Alerts Card */}
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Alerts & Notifications</h3>
                            <div className="space-y-3">
                                <div
                                    className="flex items-center gap-3 p-3 bg-red-50 rounded-2xl border border-red-100 cursor-pointer hover:bg-red-100 transition"
                                    onClick={() => navigate('/pharmacy/inventory')}
                                >
                                    <div className="bg-red-500 p-2 rounded-xl text-white">
                                        <AlertCircle size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-red-900 leading-tight">Low Stock Alert</p>
                                        <p className="text-xs text-red-600">{metrics.outOfStock} items reaching critical</p>
                                    </div>
                                    <ChevronRight size={16} className="text-red-300" />
                                </div>
                                <div
                                    className="flex items-center gap-3 p-3 bg-orange-50 rounded-2xl border border-orange-100 cursor-pointer hover:bg-orange-100 transition"
                                    onClick={() => navigate('/pharmacy/inventory')}
                                >
                                    <div className="bg-orange-500 p-2 rounded-xl text-white">
                                        <Clock size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-orange-900 leading-tight">Expiring Soon</p>
                                        <p className="text-xs text-orange-600">{metrics.expiringSoon} medicines in 30 days</p>
                                    </div>
                                    <ChevronRight size={16} className="text-orange-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

function StatusCard({ title, value, trend, icon: Icon, isPrimary = false, isNegative = false, onClick }) {
    const isUp = trend ? trend.startsWith('+') : true;
    return (
        <div
            onClick={onClick}
            className={`p-5 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between transition-all duration-300 h-full cursor-pointer hover:-translate-y-2 hover:shadow-xl ${isPrimary
                ? 'bg-primary text-white hover:bg-teal-600'
                : 'bg-white hover:bg-primary/5'
                }`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-2xl ${isPrimary ? 'bg-white/20' : 'bg-gray-50 text-gray-400'}`}>
                    <Icon size={20} className={isPrimary ? 'text-white' : ''} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${isPrimary ? 'bg-white/20 text-white' :
                        isUp ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                        {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {trend}
                    </div>
                )}
            </div>
            <div>
                <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${isPrimary ? 'text-white/70' : 'text-gray-400'}`}>{title}</p>
                <div className="flex items-baseline gap-2">
                    <h4 className="text-2xl font-black">{value}</h4>
                </div>
            </div>
        </div>
    )
}

function AIHighlight({ label, value, detail, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 transition-all duration-300 ${onClick ? 'cursor-pointer hover:bg-white/20 hover:scale-105' : ''}`}
        >
            <p className="text-xs text-white/60 mb-1">{label}</p>
            <h4 className="font-bold mb-1">{value}</h4>
            <p className="text-[10px] text-white/40">{detail}</p>
        </div>
    )
}

function QuickActionButton({ icon: Icon, label, color, bg, onClick }) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center justify-center p-4 rounded-3xl border border-gray-50 hover:border-primary/20 hover:shadow-lg transition-all duration-300 group h-full bg-white"
        >
            <div className={`p-3 rounded-2xl ${bg} ${color} mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                <Icon size={24} />
            </div>
            <span className="text-xs font-bold text-gray-600 group-hover:text-primary transition-colors text-center">{label}</span>
        </button>
    )
}

function ActivityItem({ user, action, detail, time, iconColor, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`flex gap-4 items-start p-2 rounded-2xl transition-all duration-300 ${onClick ? 'cursor-pointer hover:bg-primary/5 hover:translate-x-1' : ''}`}
        >
            <div className={`w-10 h-10 rounded-2xl ${iconColor} flex items-center justify-center text-white shrink-0 font-bold text-sm shadow-sm`}>
                {user.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 leading-normal">
                    <span className="font-bold text-gray-800">{user}</span> {action}
                    {detail && <span className="font-bold text-primary ml-1">{detail}</span>}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-tighter font-medium">{time}</p>
            </div>
        </div>
    )
}
