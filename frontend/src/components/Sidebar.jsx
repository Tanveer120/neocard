// src/components/Sidebar.jsx
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className="w-64 bg-white p-6 shadow-lg border-r border-gray-200">
      <h2 className="text-xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">Dashboard Menu</h2>
      <ul className="space-y-3">
        <li>
          <button
            onClick={() => navigate("/profile")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
              pathname === "/profile"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            Profile
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/apply-doctor")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
              pathname === "/apply-doctor"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            Apply as Doctor
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/apply-pharmacy")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
              pathname === "/apply-pharmacy"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            Apply as Pharmacy
          </button>
        </li>
        {/* Add more tabs here */}
      </ul>
    </aside>
  );
}

export default Sidebar;
