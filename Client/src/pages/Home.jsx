import { Link } from "react-router-dom";
import { ArrowRight, Settings2, Sparkles } from "lucide-react";
import KPISection from "./KPISection";
import LineChart from "../components/charts/LineChart";
import TopicBarChart from "../components/charts/TopicBarChart";

const highlights = [
  {
    title: "Signal Quality",
    value: "93.2%",
    detail: "Consistent relevance in active sectors this week.",
  },
  {
    title: "Regional Spread",
    value: "18",
    detail: "Countries with above-average likelihood signals.",
  },
  {
    title: "Decision Momentum",
    value: "+12%",
    detail: "Improvement from last reporting cycle.",
  },
];

export default function Home() {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-cyan-300/20 bg-[linear-gradient(130deg,rgba(8,47,73,0.9),rgba(15,23,42,0.92),rgba(8,145,178,0.35))] p-6 md:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-cyan-100">
            <Sparkles className="h-4 w-4" />
            Executive Briefing
          </p>
          <h2 className="text-2xl font-semibold text-white md:text-4xl">
            Transform raw intelligence into strategic decisions.
          </h2>
          <p className="text-sm leading-6 text-slate-200 md:text-base">
            Monitor sector behavior, compare country-level likelihood, and keep your
            dashboard tuned to your workflow from one place.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/charts"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              Open Charts
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/settings"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
            >
              Configure Workspace
              <Settings2 className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section>
        <KPISection />
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-xl"
          >
            <p className="text-xs uppercase tracking-[0.14em] text-cyan-200/80">{item.title}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{item.value}</p>
            <p className="mt-1 text-sm text-slate-400">{item.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="h-105">
          <LineChart />
        </div>
        <div className="h-105">
          <TopicBarChart />
        </div>
      </section>
    </div>
  );
}
