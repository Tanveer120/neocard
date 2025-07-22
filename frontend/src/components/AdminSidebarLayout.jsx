// components/SidebarLayout.jsx
import AdminSidebar from "./AdminSidebar";
import AdminNav from "./AdminNav";

function SidebarLayout({ children }) {
  return (
    <div className="flex flex-col h-screen w-screen bg-pink-100 overflow-hidden overflow-y-hidden">
        <AdminNav />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center p-6 overflow-y-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export default SidebarLayout;
