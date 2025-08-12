import { useState } from "react";
import LoggedNav from "../../components/LoggedNav";
import Profile from "../User/Profile";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile embedded />; // 🔁 Suppress navbar in embedded usage
      default:
        return <div className="p-6">Select a tab from the sidebar</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LoggedNav />
      <div className="flex">
        {/* Sidebar */}
        <aside className="min-h-screen w-70 bg-white p-6 shadow-lg border-r border-gray-200">
          <h2 className="text-xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">Dashboard Menu</h2>
          <ul className="space-y-3">
            <li>
              <button
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                  activeTab === "profile" ? "bg-blue-600 text-white shadow-md" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                Profile
              </button>
            </li>
            {/* Add more tabs here */}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">{renderContent()}</main>
      </div>
    </div>
  );
}

export default Dashboard;
