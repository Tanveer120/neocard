// src/components/AdminSidebar.jsx
import { useNavigate, useLocation } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className="w-60 bg-white p-4 shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-pink-600">Admin Panel</h2>
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => navigate("/admin/stats")}
            className={`w-full text-left px-4 py-2 rounded ${
              pathname === "/admin/stats"
                ? "bg-pink-500 text-white"
                : "hover:bg-pink-100"
            }`}
          >
            Stats
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/admin/doctor-applications")}
            className={`w-full text-left px-4 py-2 rounded ${
              pathname === "/admin/doctor-applications"
                ? "bg-pink-500 text-white"
                : "hover:bg-pink-100"
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
