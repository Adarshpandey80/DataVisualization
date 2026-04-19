import { Bell, Menu, Moon, Search, Sun, User } from "lucide-react";
import { useLocation } from "react-router-dom";
import { usePreferences } from "../context/PreferencesContext";

const pageTitles = {
  "/home": "Overview",
  "/charts": "Charts Studio",
  "/settings": "Workspace Settings",
};

const Navbar = ({ onMenuClick }) => {
  const location = useLocation();
  const { settings, updateSetting } = usePreferences();

  const pageTitle = pageTitles[location.pathname] || "Analytics";
  const currentDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="w-full border-b border-white/10 bg-slate-950/65 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-2 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div>
            <p className="text-sm tracking-[0.18em] text-cyan-300/80 uppercase">
              Blackcoffer
            </p>
            <h1 className="text-lg font-semibold text-slate-100">{pageTitle}</h1>
          </div>
        </div>

        <div className="hidden w-[320px] items-center rounded-xl border border-white/10 bg-slate-900/80 px-3 py-1.5 md:flex">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search insights..."
            className="w-full bg-transparent px-2 text-sm text-slate-100 outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              updateSetting("theme", settings.theme === "dark" ? "light" : "dark")
            }
            className="rounded-full p-2 transition hover:bg-white/10"
          >
            {settings.theme === "dark" ? (
              <Sun size={20} className="text-amber-300" />
            ) : (
              <Moon size={20} className="text-slate-300" />
            )}
          </button>

          <button className="relative rounded-full p-2 transition hover:bg-white/10">
            <Bell size={20} className="text-slate-300" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-[10px] font-semibold text-slate-900">
              3
            </span>
          </button>

          <div className="flex items-center gap-2 cursor-pointer">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500 text-slate-950">
              <User size={18} />
            </div>
            <div className="hidden leading-tight md:block">
              <p className="text-sm font-semibold text-slate-100">
                Adarsh
              </p>
              <p className="text-xs text-slate-400">
                {currentDate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
