// components/Layout/MainLayout.jsx
import LoggedInNav from "../Navbar/LoggedInNav";

const MainLayout = ({ children, onLogout }) => {
  return (
    <SidebarProvider defaultOpen={true} variant="overlay">
      <div className="flex min-h-screen bg-gray-100">
        <LoggedInNav onLogout={onLogout} />
        <main className="flex-1 ml-64 px-4 py-6">
          {" "}
          {/* Left margin = sidebar width */}
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
