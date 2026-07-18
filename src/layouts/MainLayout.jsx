import { useLocation } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar.jsx";
import BottomNav from "../components/navigation/BottomNav.jsx";

export default function MainLayout({ children }) {
  const location = useLocation();
  const hideNav = location.pathname === "/login";

  if (hideNav) return <>{children}</>;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar shows on desktop, hidden on mobile via Tailwind classes inside component */}
      <Sidebar />
      <main className="flex-1 pb-20 md:pb-0 md:ml-56">{children}</main>
      <BottomNav />
    </div>
  );
}
