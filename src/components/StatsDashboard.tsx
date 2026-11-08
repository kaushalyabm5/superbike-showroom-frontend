'use client';

import { useEffect, useState } from 'react';

interface Stats {
  total_models: number;
  total_stock: number;
  total_sold: number;
  total_revenue: number;
}

interface StatsDashboardProps {
  refreshTrigger: boolean;
}

export default function StatsDashboard({ refreshTrigger }: StatsDashboardProps) {
  const [stats, setStats] = useState<Stats>({
    total_models: 0,
    total_stock: 0,
    total_sold: 0,
    total_revenue: 0,
  });

  const fetchStats = () => {
    fetch('http://localhost:5000/api/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error('Error fetching stats:', err));
  };

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
      {/* Total Revenue */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl">
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Revenue</p>
        <h3 className="text-3xl font-extrabold text-green-400 mt-2">
          ${Number(stats.total_revenue).toLocaleString()}
        </h3>
      </div>

      {/* Bikes Sold */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl">
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Bikes Sold</p>
        <h3 className="text-3xl font-extrabold text-white mt-2">
          {stats.total_sold} <span className="text-sm font-normal text-gray-400">units</span>
        </h3>
      </div>

      {/* Available Stock */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl">
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Available Stock</p>
        <h3 className="text-3xl font-extrabold text-white mt-2">
          {stats.total_stock || 0} <span className="text-sm font-normal text-gray-400">units</span>
        </h3>
      </div>

      {/* Total Models */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl">
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Models</p>
        <h3 className="text-3xl font-extrabold text-red-400 mt-2">
          {stats.total_models} <span className="text-sm font-normal text-gray-400">types</span>
        </h3>
      </div>
    </div>
  );
}