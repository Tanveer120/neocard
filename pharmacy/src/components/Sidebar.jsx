import React from 'react';

export default function Sidebar({ children }) {
  return (
    <aside className="hidden md:block w-64 bg-white dark:bg-gray-900 border-r p-4">
      <nav className="flex flex-col gap-2">
        <a href="#/" className="py-2 px-3 rounded hover:bg-gray-50">Dashboard</a>
        <a href="#/inventory" className="py-2 px-3 rounded hover:bg-gray-50">Inventory</a>
        <a href="#/inventory/new" className="py-2 px-3 rounded hover:bg-gray-50">Add Item</a>
        <a href="#/alerts" className="py-2 px-3 rounded hover:bg-gray-50">Low Stock Alerts</a>
      </nav>
      <div className="mt-6 text-xs text-gray-400">v1.0.0 • Local</div>
    </aside>
  );
}
