// src/components/Sidebar.jsx
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className="w-60 bg-white p-4 shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-pink-600">Dashboard Menu</h2>
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => navigate("/profile")}
            className={`w-full text-left px-4 py-2 rounded ${
              pathname === "/profile"
                ? "bg-pink-500 text-white"
                : "hover:bg-pink-100"
            }`}
          >
            Profile
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/apply-doctor")}
            className={`w-full text-left px-4 py-2 rounded ${
              pathname === "/apply-doctor"
                ? "bg-pink-500 text-white"
                : "hover:bg-pink-100"
            }`}
          >
            Apply as Doctor
          </button>
        </li>
        {/* Add more tabs here */}
      </ul>
    </aside>
  );
}

export default Sidebar;
