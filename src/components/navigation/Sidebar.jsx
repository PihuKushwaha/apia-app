import { NavLink } from "react-router-dom";
import { LayoutDashboard, FolderKanban, HeartPulse, BookOpenText, BarChart3, ShieldCheck } from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/cases", label: "My Cases", icon: FolderKanban },
  { to: "/merg", label: "Merg Inquiry", icon: HeartPulse },
  { to: "/legal-kb", label: "Legal Knowledge Base", icon: BookOpenText },
  { to: "/reports", label: "Reports", icon: BarChart3 },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col md:w-60 md:fixed md:h-screen bg-navy text-white">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
        <ShieldCheck size={22} className="text-white/90" />
        <div>
          <p className="text-sm font-semibold tracking-wide">APIA</p>
          <p className="text-[10px] text-white/50 uppercase tracking-widest">Investigation Assistant</p>
        </div>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? "bg-white/15 font-medium" : "text-white/70 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={17} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}