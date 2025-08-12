// src/components/AdminSidebar.jsx
import { useNavigate, useLocation } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className="w-64 bg-white p-6 shadow-lg border-r border-gray-200">
      <h2 className="text-xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">Admin Panel</h2>
      <ul className="space-y-3">
        <li>
          <button
            onClick={() => navigate("/admin/stats")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
              pathname === "/admin/stats"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            Stats
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/admin/doctor-applications")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
              pathname === "/admin/doctor-applications"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            Doctor Applications
          </button>
        </li>
      </ul>
    </aside>
  );
}

export default AdminSidebar;
