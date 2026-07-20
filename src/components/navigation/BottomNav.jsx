import { NavLink } from "react-router-dom";
import { LayoutDashboard, FolderKanban, BookOpenText, BarChart3 } from "lucide-react";

const links = [
  { to: "/", label: "Home", icon: LayoutDashboard, end: true },
  { to: "/cases", label: "Cases", icon: FolderKanban },
  { to: "/legal-kb", label: "Legal", icon: BookOpenText },
  { to: "/reports", label: "Reports", icon: BarChart3 },
];

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-1.5 shadow-[0_-2px_8px_rgba(0,0,0,0.04)]">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] ${
                isActive ? "text-navy font-semibold" : "text-gray-400"
              }`
            }
          >
            <Icon size={18} />
            {link.label}
          </NavLink>
        );
      })}
    </nav>
  );
}