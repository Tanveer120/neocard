import React, { useEffect, useState } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import InventoryList from './pages/InventoryList';
import InventoryForm from './pages/InventoryForm';
import InventoryItem from './pages/InventoryItem';
import Dashboard from './pages/Dashboard';
import LowStock from './pages/LowStock';
import Login from './pages/Login';

function RouterLessApp() {
  const [route, setRoute] = useState(window.location.hash.slice(1) || '/');
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash.slice(1) || '/');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // simple hash parsing
  const parts = route.split('/').filter(Boolean);
  let view = null;

  if (route === '/' || route === '/dashboard') view = <Dashboard />;
  else if (route === '/inventory') view = <InventoryList />;
  else if (route === '/inventory/new') view = <InventoryForm onSaved={() => (window.location.hash = '#/inventory')} />;
  else if (parts[0] === 'inventory' && parts[1] && parts[2] === 'edit') view = <InventoryForm id={parts[1]} onSaved={() => (window.location.hash = `#/inventory/${parts[1]}`)} />;
  else if (parts[0] === 'inventory' && parts[1]) view = <InventoryItem id={parts[1]} />;
  else if (route === '/alerts' || route === '/low-stock') view = <LowStock />;
  else if (route === '/login') view = <Login />;
  else view = <div className="p-4">Not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">{view}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RouterLessApp />
    </AuthProvider>
  );
}
