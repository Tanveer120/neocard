import React, { useEffect, useState } from 'react';
import { inventory } from '../api/pharmacyApi';
import { useAuth } from '../context/AuthContext';

export default function InventoryForm({ id, onSaved }) {
  const { token } = useAuth();
  const [form, setForm] = useState({ name: '', sku: '', currentStock: 0, reorderPoint: 0, costPrice: 0, salePrice: 0, batchNumber: '', expiryDate: '' });

  useEffect(() => {
    if (!id || !token) return;
    inventory.get({ token, id }).then((res) => setForm(res.item || res));
  }, [id, token]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (id) await inventory.update({ token, id, payload: form });
      else await inventory.create({ token, payload: form });
      onSaved && onSaved();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Save failed');
    }
  };

  return (
    <form onSubmit={submit} className="p-4 max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="input" />
        <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="SKU (optional)" className="input" />
        <input type="number" value={form.currentStock} onChange={(e) => setForm({ ...form, currentStock: Number(e.target.value) })} placeholder="Current stock" className="input" />
        <input type="number" value={form.reorderPoint} onChange={(e) => setForm({ ...form, reorderPoint: Number(e.target.value) })} placeholder="Reorder point" className="input" />
        <input type="number" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: Number(e.target.value) })} placeholder="Cost price" className="input" />
        <input type="number" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: Number(e.target.value) })} placeholder="Sale price" className="input" />
        <input value={form.batchNumber} onChange={(e) => setForm({ ...form, batchNumber: e.target.value })} placeholder="Batch number" className="input" />
        <input type="date" value={form.expiryDate ? form.expiryDate.slice(0,10) : ''} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="input" />
      </div>
      <div className="mt-4 flex justify-end">
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
      </div>
    </form>
  );
}
