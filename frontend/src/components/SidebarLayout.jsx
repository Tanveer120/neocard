// components/SidebarLayout.jsx
import Sidebar from "./Sidebar";
import LoggedNav from "./LoggedNav";

function SidebarLayout({ children }) {
  return (
    <div className="flex flex-col h-screen w-screen bg-pink-100 overflow-hidden overflow-y-hidden">
      <LoggedNav />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center p-6 overflow-y-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export default SidebarLayout;
