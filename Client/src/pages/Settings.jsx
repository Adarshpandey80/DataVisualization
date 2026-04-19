import { usePreferences } from "../context/PreferencesContext";

export default function Settings() {
  const { settings, updateSetting, resetSettings } = usePreferences();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl">
        <h2 className="text-2xl font-semibold text-white">Settings</h2>
        <p className="mt-1 text-sm text-slate-400">
          Personalize your analytics workspace. Preferences are stored locally.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <label className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <p className="text-sm font-medium text-slate-200">Theme</p>
          <select
            value={settings.theme}
            onChange={(e) => updateSetting("theme", e.target.value)}
            className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </label>

        <label className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <p className="text-sm font-medium text-slate-200">Landing Page</p>
          <select
            value={settings.landingPage}
            onChange={(e) => updateSetting("landingPage", e.target.value)}
            className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
          >
            <option value="/home">Home</option>
            <option value="/charts">Charts</option>
            <option value="/settings">Settings</option>
          </select>
        </label>

        <label className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <p className="text-sm font-medium text-slate-200">Refresh Interval</p>
          <select
            value={settings.refreshInterval}
            onChange={(e) => updateSetting("refreshInterval", Number(e.target.value))}
            className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
          >
            <option value={30}>Every 30s</option>
            <option value={60}>Every 1 min</option>
            <option value={300}>Every 5 min</option>
          </select>
        </label>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 space-y-3">
          <label className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-slate-200">Compact Mode</span>
            <input
              type="checkbox"
              checked={settings.compactMode}
              onChange={(e) => updateSetting("compactMode", e.target.checked)}
              className="h-4 w-4 accent-cyan-400"
            />
          </label>
          <label className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-slate-200">Enable Animations</span>
            <input
              type="checkbox"
              checked={settings.animations}
              onChange={(e) => updateSetting("animations", e.target.checked)}
              className="h-4 w-4 accent-cyan-400"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-300/20 bg-amber-200/5 p-4">
        <p className="text-sm text-amber-100">Need a clean slate?</p>
        <button
          onClick={resetSettings}
          className="mt-3 rounded-xl bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-200"
        >
          Reset To Default
        </button>
      </section>
    </div>
  );
}
