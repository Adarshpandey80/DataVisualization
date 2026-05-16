import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import Sidebar from "./layout/Sidebar";
import { usePreferences } from "./context/PreferencesContext";

function Layout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);
  const { settings } = usePreferences();

  const handleChartSearch = (chart) => {
    setSelectedChart(chart);
    // Clear after a moment to avoid re-rendering issues
    setTimeout(() => setSelectedChart(null), 100);
  };

  return (
    <div className="min-h-screen app-shell text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.14),transparent_42%)] pointer-events-none" />

      <div className="relative z-10 flex min-h-screen">
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
          <Navbar 
            onMenuClick={() => setMobileSidebarOpen((prev) => !prev)}
            onChartSearch={handleChartSearch}
          />

          <main
            className={`flex-1 overflow-auto ${
              settings.compactMode ? "px-3 py-3 md:px-4" : "px-4 py-4 md:px-6"
            }`}
          >
            <Outlet context={{ selectedChart }} />
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Layout;
