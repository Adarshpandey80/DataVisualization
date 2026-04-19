import { useMemo, useState } from "react";

import LineChart from "../components/charts/LineChart";
import BarChart from "../components/charts/BarChart";
import AreaChart from "../components/charts/AreaChart";
import RadarChart from "../components/charts/RadarChart";
import KPISection from "./KPISection";
import RegionTreemap from "../components/charts/RegionTreemap";
import RegionStackedBar from "../components/charts/RegionStackedBar";
import TopicBarChart from "../components/charts/TopicBarChart";
import { usePreferences } from "../context/PreferencesContext";

const chartRegistry = [
  {
    id: "line",
    title: "Intensity Trend",
    className: "h-[420px]",
    Component: LineChart,
  },
  {
    id: "area",
    title: "Intensity Area",
    className: "h-[420px]",
    Component: AreaChart,
  },
  {
    id: "bar",
    title: "Likelihood by Country",
    className: "h-[420px]",
    Component: BarChart,
  },
  {
    id: "trend",
    title: "Topic Trend",
    className: "h-[420px]",
    Component: RegionTreemap,
  },
  {
    id: "radar",
    title: "Topic Radar",
    className: "h-[460px]",
    Component: RadarChart,
  },
  {
    id: "topic",
    title: "Topic Distribution",
    className: "h-[460px]",
    Component: TopicBarChart,
  },
  {
    id: "region",
    title: "Region Mix",
    className: "h-[280px] xl:col-span-2",
    Component: RegionStackedBar,
  },
];

export default function Dashboard() {
  const { settings } = usePreferences();
  const [visible, setVisible] = useState(() =>
    chartRegistry.reduce((acc, chart) => ({ ...acc, [chart.id]: true }), {})
  );

  const activeCharts = useMemo(
    () => chartRegistry.filter((chart) => visible[chart.id]),
    [visible]
  );

  const toggleChart = (id) => {
    setVisible((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetCharts = () => {
    setVisible(chartRegistry.reduce((acc, chart) => ({ ...acc, [chart.id]: true }), {}));
  };

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-white/10 bg-slate-900/65 p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/80">Charts</p>
            <h2 className="text-2xl font-semibold text-white">Analytics Studio</h2>
          </div>
          <button
            onClick={resetCharts}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            Reset View
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {chartRegistry.map((chart) => (
            <button
              key={chart.id}
              onClick={() => toggleChart(chart.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                visible[chart.id]
                  ? "bg-cyan-300 text-slate-900"
                  : "border border-white/15 bg-transparent text-slate-300"
              }`}
            >
              {chart.title}
            </button>
          ))}
        </div>
      </section>

      <section>
        <KPISection />
      </section>

      <section
        className={`grid gap-5 ${
          settings.compactMode ? "grid-cols-1" : "grid-cols-1 xl:grid-cols-2"
        }`}
      >
        {activeCharts.length ? (
          activeCharts.map(({ id, className, Component }) => (
            <div key={id} className={className}>
              <Component />
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-10 text-center text-slate-300 xl:col-span-2">
            No chart selected. Enable one or more charts from filters above.
          </div>
        )}
      </section>
    </div>
  );
}
