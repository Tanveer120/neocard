// components/SidebarLayout.jsx
import AdminSidebar from "./AdminSidebar";
import AdminNav from "./AdminNav";

function SidebarLayout({ children }) {
  return (
    <div className="flex flex-col h-screen w-screen bg-gray-50 overflow-hidden">
        <AdminNav />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}

export default SidebarLayout;
