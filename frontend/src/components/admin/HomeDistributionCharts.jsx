import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';

// Register specific Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const HomeDistributionCharts = ({ civilians, pharmacies, admins }) => {

  // Helper to process DTO list [{label, count}, ...]
  const processData = (list, defaultLabels) => {
    const map = new Map();
    if (list) {
      list.forEach(item => map.set(item.label, item.count));
    }
    const data = defaultLabels.map(label => map.get(label) || 0);
    return { labels: defaultLabels, data };
  };

  // 1. Civilian Distribution (Doughnut)
  // Backend returns: ACTIVE, TEMP_BANNED, APPEALS_PENDING
  // Map to: Active, Banned, Pending
  const civRaw = processData(civilians, ['ACTIVE', 'TEMP_BANNED', 'APPEALS_PENDING']);
  const civilianData = {
    labels: ['Active', 'Banned', 'Pending'],
    datasets: [{
      data: civRaw.data,
      backgroundColor: ['#2FA4A9', '#ef4444', '#60a5fa'],
      hoverOffset: 4,
      borderWidth: 0,
      cutout: '75%', // Thinner ring
    }]
  };

  // 2. Pharmacy Health (Bar)
  // Backend: PENDING, ACTIVE, SUSPENDED, REMOVED
  const pharmRaw = processData(pharmacies, ['ACTIVE', 'PENDING', 'SUSPENDED']);
  const pharmacyData = {
    labels: ['Active', 'Pending', 'Suspended'],
    datasets: [{
      label: 'Pharmacies',
      data: pharmRaw.data,
      backgroundColor: ['#10b981', '#fbbf24', '#ef4444'], // Green, Yellow, Red
      borderRadius: 6,
      barThickness: 50,
    }]
  };

  // 3. Admin Status (Bar)
  // Backend: ACTIVE, DEACTIVATED, REMOVED
  const adminRaw = processData(admins, ['ACTIVE', 'DEACTIVATED', 'REMOVED']);
  const adminData = {
    labels: ['Active', 'Deactivated', 'Removed'],
    datasets: [{
      label: 'Admins',
      data: adminRaw.data,
      backgroundColor: ['#8b5cf6', '#94a3b8', '#1e293b'], // Purple, Gray, Dark
      borderRadius: 6,
      barThickness: 50,
    }]
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, padding: 20, font: { family: 'Inter', size: 11, weight: '600' } }
      }
    },
    scales: {
      x: { grid: { display: false, drawBorder: false }, ticks: { font: { family: 'Inter' } } },
      y: { border: { display: false }, grid: { color: '#f1f5f9' }, ticks: { stepSize: 1, font: { family: 'Inter' } } }
    }
  };

  const doughnutOptions = {
    ...commonOptions,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, padding: 20, font: { family: 'Inter', size: 11, weight: '600' } }
      }
    },
    scales: { x: { display: false }, y: { display: false } } // No axes for doughnut
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Civilian Distribution */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col h-[400px]">
        <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">Civilian Distribution</h3>
        <div className="flex-1 relative">
          <Doughnut data={civilianData} options={doughnutOptions} />
          {/* Centered Total Text if needed, or leave simple */}
        </div>
      </div>

      {/* Pharmacy Health */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col h-[400px]">
        <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">Pharmacy Health</h3>
        <div className="flex-1">
          <Bar data={pharmacyData} options={commonOptions} />
        </div>
      </div>

      {/* Admin Status */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col h-[400px]">
        <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">Admin Status</h3>
        <div className="flex-1">
          <Bar data={adminData} options={commonOptions} />
        </div>
      </div>
    </div>
  );
};

export default HomeDistributionCharts;