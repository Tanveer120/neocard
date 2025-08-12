// components/SidebarLayout.jsx
import Sidebar from "./Sidebar";
import LoggedNav from "./LoggedNav";

function SidebarLayout({ children }) {
  return (
    <div className="flex flex-col h-screen w-screen bg-gray-50 overflow-hidden">
      <LoggedNav />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}

export default SidebarLayout;
