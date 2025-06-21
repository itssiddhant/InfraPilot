import { NavLink, Outlet, useLocation } from "react-router-dom";
import { HomeIcon, PlusCircleIcon, ClockIcon, MagnifyingGlassIcon, ShareIcon, Cog6ToothIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";

const navItems = [
  { to: "/", label: "Dashboard", icon: HomeIcon },
  { to: "/rca", label: "Submit RCA", icon: PlusCircleIcon },
  { to: "/rca/history", label: "RCA History", icon: ClockIcon },
  { to: "/semantic-search", label: "Semantic Search", icon: MagnifyingGlassIcon },
  { to: "/graph-memory", label: "Graph Memory", icon: ShareIcon },
  { to: "/integrations", label: "Integrations", icon: Cog6ToothIcon },
];

// Function to get page title from path
const getPageTitle = (pathname) => {
  if (pathname === '/') return 'Dashboard';
  const item = navItems.find(item => item.to === pathname);
  return item ? item.label : 'InfraPilot';
};

export default function Layout() {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen flex text-gray-100 font-sans bg-gradient-to-br from-[#0a0a0a] to-[#1a1a2a]">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col bg-black/30 backdrop-blur-xl border-r border-white/5 shadow-2xl">
        <div className="h-20 flex items-center justify-center gap-2">
           <WrenchScrewdriverIcon className="h-8 w-8 text-blue-400" />
           <span className="text-2xl font-extrabold text-white tracking-tight select-none">InfraPilot</span>
        </div>
        <nav className="flex-1 px-4 py-4">
          <ul className="space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-base ` +
                    (isActive
                      ? "bg-blue-600/80 text-white shadow-lg"
                      : "text-gray-400 hover:bg-white/10 hover:text-white")
                  }
                  end={to === "/"}
                >
                  <Icon className="w-6 h-6" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-white/5 text-center text-xs text-gray-500">
          <span>Version: 2.0.0</span>
        </div>
      </aside>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center h-20 px-10 border-b border-white/5 bg-black/10 backdrop-blur-xl">
          <h1 className="text-3xl font-bold text-white">{pageTitle}</h1>
        </header>
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 