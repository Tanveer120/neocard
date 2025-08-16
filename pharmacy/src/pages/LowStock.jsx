import React, { useEffect, useState } from 'react';
import { inventory } from '../api/pharmacyApi';
import { useAuth } from '../context/AuthContext';

export default function LowStock() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!token) return;
    inventory.lowStock({ token }).then((r) => setItems(r.lowStockItems || r.items || r)).catch(() => {});
  }, [token]);

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-3">Low stock alerts</h3>
      <div className="grid gap-3">
        {items.map((it) => (
          <div key={it._id} className="p-3 bg-yellow-50 rounded border">
            <div className="font-medium">{it.name}</div>
            <div className="text-sm text-gray-500">Stock: {it.currentStock} • Reorder: {it.reorderPoint}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
