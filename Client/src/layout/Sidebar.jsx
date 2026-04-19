import { useState } from "react";
import {
  Bars3BottomLeftIcon,
  ChartBarIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  Cog6ToothIcon,
  HomeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";

const menu = [
  { name: "Home", to: "/home", Icon: HomeIcon },
  { name: "Charts", to: "/charts", Icon: ChartBarIcon },
  { name: "Settings", to: "/settings", Icon: Cog6ToothIcon },
];

function Sidebar({ mobileOpen, onClose }) {
  const [open, setOpen] = useState(true);

  const navClasses = ({ isActive }) =>
    `group flex items-center rounded-xl px-3 py-2.5 transition ${
      isActive
        ? "bg-cyan-400/20 text-cyan-200"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-950/60 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-screen border-r border-white/10 bg-slate-950/85 backdrop-blur transition-all duration-300 lg:static lg:translate-x-0 ${
          open ? "w-72" : "w-20"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-cyan-400/20 p-2 text-cyan-200">
                <Bars3BottomLeftIcon className="h-5 w-5" />
              </div>
              {open && (
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">
                    Analytics
                  </p>
                  <h2 className="text-sm font-semibold text-slate-100">Control Panel</h2>
                </div>
              )}
            </div>

            <button
              onClick={() => setOpen((prev) => !prev)}
              className="hidden rounded-lg p-2 text-slate-300 transition hover:bg-white/10 lg:block"
            >
              {open ? (
                <ChevronDoubleLeftIcon className="h-5 w-5" />
              ) : (
                <ChevronDoubleRightIcon className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 lg:hidden"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-2 p-3">
            {menu.map(({ name, to, Icon }) => (
              <NavLink key={to} to={to} className={navClasses} onClick={onClose}>
                <Icon className="h-5 w-5 shrink-0" />
                {open && <span className="ml-3 text-sm font-medium">{name}</span>}
              </NavLink>
            ))}
          </nav>

          {open && (
            <div className="m-3 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4">
              <p className="text-xs text-cyan-100/85">Live Monitoring</p>
              <p className="mt-1 text-sm text-slate-200">7 data streams active</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
