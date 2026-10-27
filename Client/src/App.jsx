import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import { PreferencesProvider } from "./context/PreferencesContext";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
            <Route
              path="charts"
              element={
                <Suspense fallback={<PageFallback />}>
                  <Dashboard />
                </Suspense>
              }
            />
            <Route
              path="settings"
              element={
                <Suspense fallback={<PageFallback />}>
                  <Settings />
                </Suspense>
              }
            />
            <Route
              path="*"
              element={
                <Suspense fallback={<PageFallback />}>
                  <NotFound />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </PreferencesProvider>
  );
}

function PageFallback() {
  return <div className="min-h-105 animate-pulse rounded-2xl bg-slate-900/60" aria-busy="true" />;
}

export default App;
