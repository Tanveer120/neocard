import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const [user, setUser] = useState(null);
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    fetchUser();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-pink-200 text-gray-800 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-pink-600">Neo Health Card</h1>
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center focus:outline-none">
            <UserCircleIcon className="h-8 w-8 text-pink-600 hover:text-pink-700" />
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => navigate("/profile")}
                    className={`${
                      active ? "bg-pink-100" : ""
                    } w-full text-left px-4 py-2 text-sm text-gray-700`}
                  >
                    Profile
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

      {/* Main Section */}
      <main className="flex-grow flex items-center justify-center text-center px-4">
        <div>
          <h2 className="text-4xl font-semibold text-pink-700 mb-3">
            Welcome, {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
          </h2>
          <p className="text-gray-700 text-lg">This is your personalized dashboard.</p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
