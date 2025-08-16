import React, { useEffect, useState } from 'react';
import { inventory } from '../api/pharmacyApi';
import { useAuth } from '../context/AuthContext';

export default function InventoryList() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState(new Set());

  const load = async () => {
    try {
      const res = await inventory.list({ token, page, limit: 50, search: q });
      setItems(res.items || res);
      setTotalPages(res.totalPages || res.pages || 1);
      setSelected(new Set());
    } catch (err) {
      console.error(err);
      setItems([]);
    }
  };

  useEffect(() => {
    if (token) load();
  }, [token, page]);

  const toggle = (id) => {
    setSelected((s) => {
      const copy = new Set(s);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  const exportCSV = () => {
    const rows = items.map((it) => [it.name, it.sku, it.currentStock, it.reorderPoint, it.costPrice, it.salePrice]);
    const csv = ['Name,SKU,Stock,Reorder,Cost,Sale', ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const quickAdjust = async (id, delta) => {
    // call backend adjust endpoint if available; fallback to update
    const item = items.find((i) => i._id === id);
    if (!item) return;
    try {
      await inventory.update({ token, id, payload: { currentStock: item.currentStock + delta } });
      load();
    } catch (err) {
      console.error(err);
      alert('Failed to adjust');
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
        <h2 className="text-xl font-semibold">Inventory</h2>
        <div className="flex gap-2 w-full md:w-auto">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, sku, barcode..."
            className="input flex-1"
          />
          <button className="px-3 py-2 bg-indigo-600 text-white rounded" onClick={() => load()}>
            Search
          </button>
          <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={exportCSV}>
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left"><input type="checkbox" onChange={(e) => {
                if (e.target.checked) setSelected(new Set(items.map(i=>i._id)));
                else setSelected(new Set());
              }} /></th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">SKU</th>
              <th className="p-2 text-left">Stock</th>
              <th className="p-2 text-left">Reorder</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it._id} className={`border-t ${it.currentStock <= it.reorderPoint ? 'bg-yellow-50' : ''}`}>
                <td className="p-2"><input checked={selected.has(it._id)} onChange={() => toggle(it._id)} type="checkbox" /></td>
                <td className="p-2"><div className="font-medium">{it.name}</div><div className="text-xs text-gray-500">{it.genericName}</div></td>
                <td className="p-2">{it.sku || it.barcode || '-'}</td>
                <td className="p-2">{it.currentStock}</td>
                <td className="p-2">{it.reorderPoint}</td>
                <td className="p-2 flex gap-2">
                  <a className="px-2 py-1 bg-indigo-600 text-white rounded" href={`#/inventory/${it._id}`}>View</a>
                  <button className="px-2 py-1 bg-yellow-500 text-white rounded" onClick={() => (window.location.hash = `#/inventory/${it._id}/edit`)}>Edit</button>
                  <button className="px-2 py-1 bg-green-500 text-white rounded" onClick={() => quickAdjust(it._id, 1)}>+1</button>
                  <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => quickAdjust(it._id, -1)}>-1</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex gap-2 items-center">
        <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 border rounded">
          Prev
        </button>
        <div className="px-3 py-1">Page {page} / {totalPages}</div>
        <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 border rounded">
          Next
        </button>
      </div>
    </div>
  );
}
