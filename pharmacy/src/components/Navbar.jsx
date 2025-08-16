import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { token, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 shadow p-3">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setMobileOpen((s) => !s)}>
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          <div>
            <div className="text-2xl font-bold text-indigo-600">NeoHealthCard • Pharmacy</div>
            <div className="text-xs text-gray-500">Inventory management</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block text-sm text-gray-600">{token ? 'Signed in' : 'Not signed in'}</div>
          {token ? (
            <button className="px-3 py-1 rounded bg-red-500 text-white text-sm" onClick={logout}>
              Logout
            </button>
          ) : (
            <a href="#/login" className="text-sm text-indigo-600 hover:underline">Login</a>
          )}
        </div>
      </div>
      {/* Mobile hint: open sidebar via hash navigation; the Sidebar component monitors hash */}
    </header>
  );
}
