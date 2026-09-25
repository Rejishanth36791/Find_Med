import React, { useEffect, useState } from 'react';
import HomeMetricCard from '../../components/admin/HomeMetricCard';
import HomeReservationChart from '../../components/admin/HomeReservationChart';
import HomeQuickAccess from '../../components/admin/HomeQuickAccess';
import HomeAlertCard from '../../components/admin/HomeAlertCard';
import HomeDistributionCharts from '../../components/admin/HomeDistributionCharts';
import {
  fetchDashboardStats,
  fetchPendingAlerts,
  fetchReservationsChart,
  fetchCiviliansChart,
  fetchPharmaciesChart,
  fetchAdminsChart
} from '../../api/dashboardApi';
import adminClient from '../../api/adminClient';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [reservationData, setReservationData] = useState(null);
  const [distData, setDistData] = useState({ civilians: null, pharmacies: null, admins: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          overviewRes,
          alertsRes,
          resChartRes,
          civChartRes,
          pharmChartRes,
          adminChartRes
        ] = await Promise.all([
          adminClient.get("/api/admin/dashboard/overview/super"),
          fetchPendingAlerts(),
          fetchReservationsChart(30),
          fetchCiviliansChart(),
          fetchPharmaciesChart(),
          fetchAdminsChart()
        ]);

        setMetrics(overviewRes.data);
        setAlerts(alertsRes);
        setReservationData(resChartRes);
        console.log("Reservation Data:", resChartRes); // Debug log
        setDistData({
          civilians: civChartRes,
          pharmacies: pharmChartRes,
          admins: adminChartRes
        });
      } catch (e) {
        console.error("Dashboard load failed", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Default metrics if loading or error
  const metricsData = [
    { label: "Total Civilians", value: metrics?.totalCivilians?.toString() || "0", color: "#3b82f6" },
    { label: "Total Admins", value: metrics?.totalAdmins?.toString() || "0", color: "#ef4444" },
    { label: "Active Admins", value: metrics?.activeAdmins?.toString() || "0", color: "#f97316" },
    { label: "Total Pharmacies", value: metrics?.totalPharmacies?.toString() || "0", color: "#8b5cf6" },
    { label: "Pending Pharmacy Approval", value: metrics?.pendingPharmacyApprovals?.toString() || "0", color: "#10b981" }
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {metricsData.map((metric, index) => (
          <HomeMetricCard
            key={index}
            label={metric.label}
            value={loading ? "..." : metric.value}
            borderColor={metric.color}
          />
        ))}
      </div>

      {/* 2. Middle Section: Large Analytics & Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reservation Analytics Chart */}
        <div className="lg:col-span-2 flex flex-col h-[500px] bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <div className="flex-1 w-full h-full">
            {/* Pass data to chart */}
            <HomeReservationChart chartData={reservationData} />
          </div>
        </div>

        {/* Right Sidebar: Quick Actions & Alerts */}
        <div className="flex flex-col h-[500px] gap-6">
          <div className="flex-1">
            <HomeQuickAccess />
          </div>
          <div className="flex-initial h-[200px]">
            <HomeAlertCard data={alerts} />
          </div>
        </div>
      </div>

      {/* 3. Bottom Section: Categorized Distribution Charts */}
      <HomeDistributionCharts
        civilians={distData.civilians}
        pharmacies={distData.pharmacies}
        admins={distData.admins}
      />
    </div>
  );
};

export default AdminDashboard;