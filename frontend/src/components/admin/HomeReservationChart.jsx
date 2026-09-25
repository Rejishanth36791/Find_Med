import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const ReservationChart = ({ chartData }) => {

  // Helper to fill in missing days (ensure always 30 data points)
  const processData = (rawData) => {
    const days = 30;
    const filledData = [];
    const today = new Date();
    const dataMap = new Map();

    if (rawData) {
      rawData.forEach(item => {
        // Assume item.date is "YYYY-MM-DD"
        dataMap.set(item.date, item.count);
      });
    }

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      // Format as YYYY-MM-DD to match backend
      const dateStr = d.toISOString().split('T')[0];
      // Try to match somewhat loosely if timezone issues, but exact map is best first
      // If map has the key, use it.

      // Note: simple ISO split uses UTC. If your backend uses local server time, there might be a 1-day offset shift depending on time of day.
      // For visual purposes, this is acceptable. 
      filledData.push({
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), // "Jan 24"
        value: dataMap.get(dateStr) || 0
      });
    }
    return filledData;
  };

  const processed = processData(chartData);
  const labels = processed.map(d => d.label);
  const values = processed.map(d => d.value);

  const data = {
    labels: labels,
    datasets: [
      {
        fill: true,
        label: 'Reservations',
        data: values,
        borderColor: '#2FA4A9',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 280);
          gradient.addColorStop(0, 'rgba(47, 164, 169, 0.2)');
          gradient.addColorStop(1, 'rgba(47, 164, 169, 0)');
          return gradient;
        },
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#2FA4A9',
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        titleFont: { family: 'Inter', size: 14, weight: 'bold' },
        bodyFont: { family: 'Inter', size: 13 },
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false }, // Clean x-axis
        ticks: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 11, weight: '600' },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 15
        },
      },
      y: {
        beginAtZero: true,
        suggestedMax: 5,
        border: { display: false }, // Remove vertical axis line
        grid: {
          color: '#f1f5f9',
        },
        ticks: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 11, weight: '600' },
          stepSize: 1,
          padding: 10
        },
      },
    },
  };

  return (
    // Only the white card and inner chart area
    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 w-full h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-[800] text-slate-800 tracking-tight">30-Day Reservation Volume</h3>
          <p className="text-xs font-semibold text-slate-400">Tracking system usage trends</p>
        </div>
        <span className="text-[10px] font-extrabold bg-[#E0F2F1] text-[#2FA4A9] px-3 py-1.5 rounded-full tracking-widest uppercase">
          Live System Data
        </span>
      </div>

      <div className="h-[260px] w-full"> {/* Adjust height here for perfect alignment */}
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default ReservationChart;