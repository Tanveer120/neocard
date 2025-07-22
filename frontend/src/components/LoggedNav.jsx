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
    <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <h1
        className="text-2xl font-bold text-pink-600 cursor-pointer"
        onClick={() => navigate("/")}
      >
        Neo Health Card
      </h1>

      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center focus:outline-none">
          <UserCircleIcon className="h-8 w-8 text-pink-600 hover:text-pink-700" />
        </Menu.Button>

        <Menu.Items className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="py-1">

            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => navigate("/profile")}
                  className={`${
                    active ? "bg-pink-100" : ""
                  } w-full text-left px-4 py-2 text-sm text-gray-700`}
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
                    active ? "bg-pink-100" : ""
                  } w-full text-left px-4 py-2 text-sm text-gray-700`}
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
