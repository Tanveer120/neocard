import React, { useEffect, useState } from 'react';
import { inventory } from '../api/pharmacyApi';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState({ totalItems: 0, outOfStock: 0, lowStock: 0, totalValue: 0 });

  useEffect(() => {
    if (!token) return;
    inventory.stats({ token }).then((r) => setStats(r)).catch(() => {});
  }, [token]);

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 bg-white rounded shadow">
        <div className="text-sm text-gray-500">Total items</div>
        <div className="text-2xl font-bold">{stats.totalItems}</div>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <div className="text-sm text-gray-500">Low stock</div>
        <div className="text-2xl font-bold text-yellow-600">{stats.lowStock}</div>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <div className="text-sm text-gray-500">Out of stock</div>
        <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
      </div>
    </div>
  );
}
