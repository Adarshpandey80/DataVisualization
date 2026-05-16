import { Bell, Menu, Moon, Search, Sun, User, X, ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import { usePreferences } from "../context/PreferencesContext";
import { useState, useRef, useEffect } from "react";

const pageTitles = {
  "/home": "Overview",
  "/charts": "Charts Studio",
  "/settings": "Workspace Settings",
};

// Available charts for search
const AVAILABLE_CHARTS = [
  { id: "line", title: "Intensity Trend", category: "Charts" },
  { id: "area", title: "Intensity Area", category: "Charts" },
  { id: "bar", title: "Likelihood by Country", category: "Charts" },
  { id: "trend", title: "Topic Trend", category: "Charts" },
  { id: "radar", title: "Topic Radar", category: "Charts" },
  { id: "topic", title: "Topic Distribution", category: "Charts" },
  { id: "region", title: "Region Mix", category: "Charts" },
];

const Navbar = ({ onMenuClick, onChartSearch }) => {
  const location = useLocation();
  const { settings, updateSetting } = usePreferences();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchContainerRef = useRef(null);

  const pageTitle = pageTitles[location.pathname] || "Analytics";
  const currentDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  // Filter charts based on search query
  const filteredCharts = searchQuery.trim()
    ? AVAILABLE_CHARTS.filter((chart) =>
        chart.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chart.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen && e.key === "ArrowDown") {
      setIsOpen(true);
      return;
    }

    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCharts.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && filteredCharts[selectedIndex]) {
          handleChartSelect(filteredCharts[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleChartSelect = (chart) => {
    if (onChartSearch) {
      onChartSearch(chart);
    }
    setSearchQuery("");
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsOpen(false);
    setSelectedIndex(-1);
  };

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

        <div
          ref={searchContainerRef}
          className="relative hidden w-[320px] md:block"
        >
          <div className="flex items-center rounded-xl border border-white/10 bg-slate-900/80 px-3 py-1.5 transition focus-within:border-cyan-400/50 focus-within:bg-slate-900">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search charts..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsOpen(e.target.value.length > 0);
                setSelectedIndex(-1);
              }}
              onFocus={() => searchQuery && setIsOpen(true)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent px-2 text-sm text-slate-100 outline-none placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="text-slate-400 hover:text-slate-200 transition"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Dropdown Suggestions */}
          {isOpen && filteredCharts.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden">
              <div className="max-h-[400px] overflow-y-auto">
                {filteredCharts.map((chart, index) => (
                  <button
                    key={chart.id}
                    onClick={() => handleChartSelect(chart)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full px-4 py-3 flex items-center justify-between text-left transition ${
                      index === selectedIndex
                        ? "bg-cyan-500/20 border-l-2 border-cyan-400"
                        : "hover:bg-white/5 border-l-2 border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-100">
                          {chart.title}
                        </p>
                        <p className="text-xs text-slate-400">{chart.category}</p>
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      className={`text-slate-400 transition ${
                        index === selectedIndex ? "text-cyan-400" : ""
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results message */}
          {isOpen && searchQuery && filteredCharts.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl z-50 p-4">
              <p className="text-sm text-slate-400 text-center">
                No charts found for "{searchQuery}"
              </p>
            </div>
          )}
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
