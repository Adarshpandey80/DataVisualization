import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Settings2, Sparkles } from "lucide-react";
import KPISection from "./KPISection";

const LineChart = lazy(() => import("../components/charts/LineChart"));
const TopicBarChart = lazy(() => import("../components/charts/TopicBarChart"));

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

function DeferredCharts() {
  const sectionRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!sectionRef.current || shouldRender) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [shouldRender]);

  return (
    <section
      ref={sectionRef}
      className="grid min-h-105 grid-cols-1 gap-5 xl:grid-cols-2"
      aria-label="Dashboard charts"
    >
      {shouldRender ? (
        <Suspense fallback={<ChartPlaceholder />}>
          <div className="h-105">
            <LineChart />
          </div>
          <div className="h-105">
            <TopicBarChart />
          </div>
        </Suspense>
      ) : (
        <ChartPlaceholder />
      )}
    </section>
  );
}

function ChartPlaceholder() {
  return (
    <>
      <div className="h-105 animate-pulse rounded-2xl border border-white/10 bg-slate-900/60" />
      <div className="h-105 animate-pulse rounded-2xl border border-white/10 bg-slate-900/60" />
    </>
  );
}

export default function Home() {
  return (
    <div className="space-y-6">
      <section className="relative isolate overflow-hidden rounded-3xl border border-cyan-200/20 bg-[linear-gradient(125deg,#082f49_0%,#0f172a_55%,#164e63_100%)] p-6 shadow-2xl shadow-cyan-950/30 md:p-8 lg:p-10">
        <div className="absolute -right-24 -top-28 -z-10 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-36 left-1/3 -z-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[32px_32px] opacity-30" aria-hidden="true" />

        <div className="relative z-10 grid items-end gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(220px,0.6fr)]">
          <div className="max-w-3xl space-y-5">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-cyan-100">
            <Sparkles className="h-4 w-4 text-cyan-300" aria-hidden="true" />
            Executive Briefing
          </p>
            <div className="space-y-3">
              <h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Transform raw intelligence into strategic decisions.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-200/90 md:text-base">
                Monitor sector behavior, compare country-level likelihood, and keep your
                dashboard tuned to your workflow from one place.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                to="/charts"
                className="group inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:-translate-y-0.5 hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                Open Charts
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <Link
                to="/settings"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:border-cyan-200/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                Configure Workspace
                <Settings2 className="h-4 w-4 text-cyan-200" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="hidden rounded-2xl border border-white/10 bg-slate-950/25 p-5 backdrop-blur-sm lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/80">
              Workspace pulse
            </p>
            <div className="mt-4 flex items-end gap-3">
              <span className="text-4xl font-semibold tracking-tight text-white">Live</span>
              <span className="mb-1 inline-flex items-center gap-1.5 text-xs text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.9)]" />
                Monitoring
              </span>
            </div>
            <p className="mt-2 text-sm leading-5 text-slate-300">
              Your decision signals are ready for review.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="kpi-heading">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300/80">At a glance</p>
            <h2 id="kpi-heading" className="mt-1 text-lg font-semibold text-white">Workspace signals</h2>
          </div>
          <span className="hidden text-xs text-slate-500 sm:block">Updated from your latest data</span>
        </div>
        <KPISection />
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3" aria-labelledby="highlights-heading">
        <div className="md:col-span-3">
          <p id="highlights-heading" className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300/80">
            Strategic highlights
          </p>
        </div>
        {highlights.map((item) => (
          <article
            key={item.title}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(15,23,42,0.92),rgba(8,47,73,0.62))] p-5 shadow-xl shadow-slate-950/20 transition duration-200 hover:-translate-y-1 hover:border-cyan-300/30 hover:shadow-cyan-950/30"
          >
            <div className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-cyan-300/10 blur-2xl transition group-hover:bg-cyan-300/20" aria-hidden="true" />
            <p className="relative text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200/80">{item.title}</p>
            <p className="relative mt-3 text-3xl font-semibold tracking-tight text-white">{item.value}</p>
            <p className="relative mt-2 max-w-xs text-sm leading-5 text-slate-400">{item.detail}</p>
          </article>
        ))}
      </section>

      <DeferredCharts />
    </div>
  );
}
