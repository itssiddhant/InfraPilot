import { NavLink } from "react-router-dom";
import { HomeIcon, PlusCircleIcon, ClockIcon, DocumentTextIcon, MagnifyingGlassIcon, ShareIcon, ChartBarIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
const navItems = [
  { to: "/", label: "Dashboard", icon: HomeIcon },
  { to: "/rca", label: "Submit RCA", icon: PlusCircleIcon },
  { to: "/rca/history", label: "RCA History", icon: ClockIcon },
  { to: "/logs", label: "Logs", icon: DocumentTextIcon },
  { to: "/semantic-search", label: "Semantic Search", icon: MagnifyingGlassIcon },
  { to: "/graph-memory", label: "Graph Memory", icon: ShareIcon },
  // Add more as needed
];

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col bg-gray-900 border-r border-gray-800 shadow-lg">
        <div className="h-16 flex items-center justify-center border-b border-gray-800">
          <span className="text-2xl font-extrabold text-blue-400 tracking-tight select-none">InfraPilot</span>
        </div>
        <nav className="flex-1 py-6 px-2 space-y-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-base ` +
                (isActive
                  ? "bg-blue-700 text-white shadow"
                  : "hover:bg-gray-800 hover:text-blue-300 text-gray-300")
              }
              end={to === "/"}
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto p-4 border-t border-gray-800 text-xs text-gray-500 flex items-center gap-2">
          <Cog6ToothIcon className="w-4 h-4" />
          Settings
        </div>
      </aside>
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 flex items-center px-4 bg-gray-950 border-b border-gray-800 shadow-sm sticky top-0 z-40">
          <div className="flex-1 flex items-center">
            {/* Placeholder for search or page title */}
          </div>
          {/* User/profile area could go here */}
        </header>
        <main className="flex-1 p-4 md:p-8 bg-gray-950 overflow-x-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 