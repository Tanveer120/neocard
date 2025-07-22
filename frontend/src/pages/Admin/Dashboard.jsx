import { useState } from "react";
import LoggedNav from "../../components/LoggedNav";
import Profile from "../User/Profile";
import AdminSidebar from "../../components/AdminSidebar";
import AdminNav from "../../components/AdminNav";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "stats":
        return <AdminStats embedded />; // 🔁 Suppress navbar in embedded usage
      default:
        return <div className="p-6">Select a tab from the sidebar</div>;
    }
  };

  return (
    <div className="min-h-screen bg-pink-100">
      <AdminNav />
      <div className="flex">
        {/* Sidebar */}
        <aside className="min-h-screen w-70 bg-white p-4 shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-pink-600">Dashboard Menu</h2>
          <ul className="space-y-2">
            <li>
              <button
                className={`w-full text-left px-4 py-2 rounded ${
                  activeTab === "stats" ? "bg-pink-500 text-white" : "hover:bg-pink-100"
                }`}
                onClick={() => setActiveTab("stats")}
              >
                Stats
              </button>
            </li>
            {/* Add more tabs here */}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  );
}

export default Dashboard;
