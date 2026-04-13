import { Outlet, Link, useLocation } from "react-router";
import { LayoutDashboard, Target, Briefcase, BarChart3, AlertTriangle, Users, FileText } from "lucide-react";
import clsx from "clsx";

export function DashboardLayout() {
  const location = useLocation();

  const navItems = [
    { name: "Business Pulse", path: "/", icon: LayoutDashboard },
    { name: "Financial Analytics", path: "/financial", icon: BarChart3 },
    { name: "Project Portfolio", path: "/projects", icon: Briefcase },
    { name: "Risk Command", path: "/risk", icon: AlertTriangle },
    { name: "Resource Ops", path: "/resources", icon: Users },
    { name: "Strategic Targets", path: "/targets", icon: Target },
    { name: "Executive Reports", path: "/reports", icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <div className="w-52 bg-[#0B233A] text-slate-300 flex flex-col shrink-0">
        <div className="h-12 flex items-center px-4 bg-[#081A2C]">
          <div className="text-white font-bold text-sm tracking-wide flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-500 rounded-sm shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            DAR AL RIYADH
          </div>
        </div>
        <div className="px-3 py-4 flex-1 overflow-y-auto">
          <div className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Executive Command</div>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={clsx(
                    "flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors",
                    isActive ? "bg-blue-600/20 text-blue-400 border border-blue-500/20" : "hover:bg-slate-800 hover:text-white border border-transparent"
                  )}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-3 bg-[#081A2C] border-t border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">CEO</div>
            <div>
              <div className="text-xs font-semibold text-white">Executive View</div>
              <div className="text-[10px] text-slate-500">Updated: 08:30 AM</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-10">
          <div>
            <h1 className="text-base font-bold text-slate-800 tracking-tight">PMCM - BUSINESS DIVISION REVIEW</h1>
            <p className="text-[10px] text-slate-500 font-medium">Reporting Period: Q1 2026 (Mar YTD) • Confidential</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-md border border-slate-200">
              <span className="text-[10px] font-semibold text-slate-500 pl-1.5">Portfolio:</span>
              <select className="bg-white border-none text-xs rounded px-1.5 py-0.5 text-slate-700 font-bold focus:ring-0 cursor-pointer outline-none">
                <option>All Portfolios</option>
                <option>Infrastructure</option>
                <option>Real Estate</option>
              </select>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-md border border-slate-200">
              <span className="text-[10px] font-semibold text-slate-500 pl-1.5">Period:</span>
              <select className="bg-white border-none text-xs rounded px-1.5 py-0.5 text-slate-700 font-bold focus:ring-0 cursor-pointer outline-none">
                <option>Mar 2026</option>
                <option>Feb 2026</option>
                <option>Q1 2026 Summary</option>
              </select>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors shadow-sm">
              Export Brief
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}