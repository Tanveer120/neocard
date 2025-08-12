import { Menu } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoggedNav() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <h1
        className="text-2xl font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
        onClick={() => navigate("/admin-dashboard")}
      >
        Neo Health Card - Admin
      </h1>

      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center focus:outline-none hover:bg-gray-50 p-2 rounded-lg transition-colors">
          <UserCircleIcon className="h-8 w-8 text-gray-600 hover:text-blue-600" />
        </Menu.Button>

        <Menu.Items className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          <div className="py-2">

            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => navigate("/profile")}
                  className={`${
                    active ? "bg-blue-50 text-blue-600" : "text-gray-700"
                  } w-full text-left px-4 py-3 text-sm font-medium transition-colors`}
                >
                  Dashboard
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleLogout}
                  className={`${
                    active ? "bg-red-50 text-red-600" : "text-gray-700"
                  } w-full text-left px-4 py-3 text-sm font-medium transition-colors`}
                >
                  Logout
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Menu>
    </nav>
  );
}

export default LoggedNav;
