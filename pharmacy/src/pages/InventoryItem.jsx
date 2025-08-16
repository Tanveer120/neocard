import React, { useEffect, useState } from 'react';
import { inventory } from '../api/pharmacyApi';
import { useAuth } from '../context/AuthContext';

export default function InventoryItem({ id }) {
  const { token } = useAuth();
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (!id || !token) return;
    inventory.get({ token, id }).then((res) => setItem(res.item || res));
  }, [id, token]);

  if (!item) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="bg-white rounded shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <div className="text-sm text-gray-500">SKU: {item.sku}</div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="p-3 border rounded">
              <div className="text-xs text-gray-400">Stock</div>
              <div className="font-medium text-xl">{item.currentStock}</div>
            </div>
            <div className="p-3 border rounded">
              <div className="text-xs text-gray-400">Cost</div>
              <div className="font-medium">{item.costPrice}</div>
            </div>
            <div className="p-3 border rounded">
              <div className="text-xs text-gray-400">Sale</div>
              <div className="font-medium">{item.salePrice}</div>
            </div>
            <div className="p-3 border rounded">
              <div className="text-xs text-gray-400">Expiry</div>
              <div className="font-medium">{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : '-'}</div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold">Recent transactions</h4>
          {(item.transactions || []).length === 0 && <div className="text-sm text-gray-500">No recent transactions</div>}
          <ul className="mt-2">
            {(item.transactions || []).map((t) => (
              <li key={t._id} className="border-b py-2">
                <div className="text-sm">{t.transactionType} • {t.quantity}</div>
                <div className="text-xs text-gray-400">By {t.createdBy?.firstName || 'System'} at {new Date(t.createdAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
