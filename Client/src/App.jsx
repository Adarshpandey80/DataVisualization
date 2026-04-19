import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { PreferencesProvider } from "./context/PreferencesContext";

const SETTINGS_KEY = "bc_settings";

const getLandingPage = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    return stored.landingPage || "/home";
  } catch {
    return "/home";
  }
};

function App() {
  const landingPage = getLandingPage();

  return (
    <PreferencesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to={landingPage} replace />} />
            <Route path="home" element={<Home />} />
            <Route path="charts" element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PreferencesProvider>
  );
}

export default App;
