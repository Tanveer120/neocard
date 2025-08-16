import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      window.location.hash = '#/inventory';
    } catch (err) {
      alert(err.message || 'Login failed');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Pharmacy Sign in</h2>
      <form onSubmit={submit} className="grid gap-3">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border p-2 rounded" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="border p-2 rounded" />
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded">Sign in</button>
        </div>
      </form>
    </div>
  );
}
