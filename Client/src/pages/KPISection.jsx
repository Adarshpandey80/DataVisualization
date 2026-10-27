import { useEffect, useState } from "react";
import axios from "axios";
import { usePreferences } from "../context/PreferencesContext";

const api = `${import.meta.env.VITE_BACKEND_URL}/data/kpi`;

export default function KPISection() {
  const { settings } = usePreferences();
  const [kpi, setKpi] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchKpi = async () => {
      try {
        const res = await axios.get(api);
        if (mounted) {
          setKpi(res.data);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchKpi();

    const interval = window.setInterval(fetchKpi, settings.refreshInterval * 1000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, [settings.refreshInterval]);

  if (loading && !kpi) {
    return (
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-23 animate-pulse rounded-xl border border-white/10 bg-slate-900/65"
          />
        ))}
      </div>
    );
  }

  if (!kpi) return null;

  const cards = [
    { title: "Total Records", value: kpi.totalRecords },
    { title: "Avg Intensity", value: kpi.avgIntensity.toFixed(2) },
    { title: "Avg Likelihood", value: kpi.avgLikelihood.toFixed(2) },
    { title: "Avg Relevance", value: kpi.avgRelevance.toFixed(2) },
    { title: "Top Sector", value: kpi.topSector },
    { title: "Top Country", value: kpi.topCountry },
  ];

  return (
    <div className="mb-0 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-6">
      {cards.map((c, i) => (
        <div
          key={i}
          className={`relative min-h-23 rounded-xl border border-white/10 bg-slate-900 p-4 shadow-xl ${
            settings.animations ? "kpi-card-enter hover:-translate-y-1" : ""
          }`}
        >
          <p className="text-xs text-gray-400 tracking-wide">{c.title}</p>
          <h2 className="text-2xl font-bold mt-1 text-cyan-300">{c.value}</h2>
        </div>
      ))}
    </div>
  );
}
