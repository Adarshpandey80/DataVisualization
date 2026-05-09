import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import ChartCard from "../../layout/ChartCard";
import ChartModal from "../common/ChartModel";
import useChartDimensions from "../../hooks/useChartDimensions";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";

const api = `${import.meta.env.VITE_BACKEND_URL}/data/region-distribution`;

export default function RegionStackedBar() {
  const containerRef = useRef();
  const svgRef = useRef();
  const tooltipRef = useRef();
  const modalRef = useRef();
  const modalSvgRef = useRef();
  const modalTooltipRef = useRef();
  
  const { width, height } = useChartDimensions(containerRef);
  const modalSize = useChartDimensions(modalRef);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios.get(api).then((res) => setData(res.data));
  }, []);

  const displayData = useMemo(() => {
    if (!data.length) return [];

    const cleaned = data
      .filter((item) => item?.label && Number(item.value) > 0)
      .sort((a, b) => b.value - a.value);

    const top = cleaned.slice(0, 7);
    const remaining = cleaned.slice(7);
    const otherValue = d3.sum(remaining, (d) => d.value);

    if (otherValue > 0) {
      top.push({ label: "Other", value: otherValue });
    }

    return top;
  }, [data]);

  const draw = (svgNode, tooltipNode, w, h, containerNode) => {
    if (!svgNode || !displayData.length || !w || !h) return;

    const chartHeight = Math.max(96, Math.min(120, h * 0.42));
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const innerWidth = w - margin.left - margin.right;

    const svg = d3.select(svgNode);
    svg.selectAll("*").remove();
    svg.attr("width", w).attr("height", chartHeight + margin.top + margin.bottom);

    const total = d3.sum(displayData, (d) => d.value);
    if (!total) return;

    const color = d3
      .scaleOrdinal()
      .domain(displayData.map((d) => d.label))
      .range([
        "#38bdf8",
        "#22d3ee",
        "#2dd4bf",
        "#34d399",
        "#84cc16",
        "#f59e0b",
        "#fb7185",
        "#a78bfa",
      ]);

    const x = d3
      .scaleLinear()
      .domain([0, total])
      .range([0, innerWidth]);

    const root = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select(tooltipNode);

    let cumulative = 0;
    const segments = displayData.map((item) => {
      const start = cumulative;
      cumulative += item.value;
      return {
        ...item,
        start,
        width: x(item.value),
        percent: (item.value / total) * 100,
      };
    });

    root
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", innerWidth)
      .attr("height", chartHeight)
      .attr("rx", 14)
      .attr("fill", "#0f172a")
      .attr("stroke", "rgba(148, 163, 184, 0.35)");

    const bars = root
      .selectAll("g.segment")
      .data(segments)
      .enter()
      .append("g")
      .attr("class", "segment")
      .attr("transform", (d) => `translate(${x(d.start)}, 0)`);

    bars
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", chartHeight)
      .attr("width", 0)
      .attr("fill", (d) => color(d.label))
      .attr("opacity", 0.95)
      .on("mousemove", (event, d) => {
        const ref = containerNode || containerRef.current;
        const [mx, my] = d3.pointer(event, ref);
        tooltip
          .style("opacity", 1)
          .style("left", `${mx + 14}px`)
          .style("top", `${Math.max(8, my - 14)}px`)
          .html(
            `<div class=\"font-semibold\">${d.label}</div><div>${d.value} records</div><div>${d.percent.toFixed(
              1
            )}% share</div>`
          );
      })
      .on("mouseleave", () => tooltip.style("opacity", 0))
      .transition()
      .duration(900)
      .ease(d3.easeCubicOut)
      .attr("width", (d) => Math.max(1, d.width));

    root
      .selectAll("text.label")
      .data(segments.filter((d) => d.percent >= 9))
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.start) + d.width / 2)
      .attr("y", chartHeight / 2 + 5)
      .attr("text-anchor", "middle")
      .text((d) => `${d.percent.toFixed(0)}%`)
      .style("fill", "#082f49")
      .style("font-size", "11px")
      .style("font-weight", "700");
  };

  useEffect(() => {
    if (!displayData.length || !width || !height) return;
    draw(svgRef.current, tooltipRef.current, width, height, containerRef.current);
  }, [displayData, width, height]);

  useEffect(() => {
    if (open && modalSvgRef.current && modalSize.width && modalSize.height) {
      draw(modalSvgRef.current, modalTooltipRef.current, modalSize.width, modalSize.height, modalRef.current);
    }
  }, [open, displayData, modalSize]);

  return (
    <>
      <ChartCard 
        title="🌍 Region Distribution (Stacked Bar)"
        action={
          <ArrowsPointingOutIcon 
            onClick={() => setOpen(true)}
            className="w-5 h-5 cursor-pointer hover:text-cyan-400" 
          />
        }
      >
        <div ref={containerRef} className="relative h-full w-full overflow-hidden">
          <svg ref={svgRef} className="w-full max-w-full block" style={{ display: 'block' }} />

          <div
            ref={tooltipRef}
            className="pointer-events-none absolute z-10 rounded-lg border border-white/20 bg-slate-900/95 px-3 py-2 text-xs text-slate-100 shadow-2xl"
            style={{ opacity: 0 }}
          />

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {displayData.map((item, index) => {
              const total = d3.sum(displayData, (d) => d.value) || 1;
              const percent = ((item.value / total) * 100).toFixed(1);
              const colors = [
                "#38bdf8",
                "#22d3ee",
                "#2dd4bf",
                "#34d399",
                "#84cc16",
                "#f59e0b",
                "#fb7185",
                "#a78bfa",
              ];

              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-900/50 px-4 py-3"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="truncate text-xs text-slate-200">
                      {item.label}
                    </span>
                  </div>
                  <span className="ml-2 text-xs font-semibold text-cyan-300 shrink-0">
                    {item.value} ({percent}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </ChartCard>

      <ChartModal open={open} onClose={() => setOpen(false)}>
        <div ref={modalRef} className="w-full h-full flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <svg ref={modalSvgRef} className="w-full max-w-full block" style={{ display: 'block' }} />

            <div
              ref={modalTooltipRef}
              className="pointer-events-none absolute z-10 rounded-lg border border-white/20 bg-slate-900/95 px-3 py-2 text-xs text-slate-100 shadow-2xl"
              style={{ opacity: 0 }}
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {displayData.map((item, index) => {
              const total = d3.sum(displayData, (d) => d.value) || 1;
              const percent = ((item.value / total) * 100).toFixed(1);
              const colors = [
                "#38bdf8",
                "#22d3ee",
                "#2dd4bf",
                "#34d399",
                "#84cc16",
                "#f59e0b",
                "#fb7185",
                "#a78bfa",
              ];

              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-900/50 px-4 py-3"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="truncate text-xs text-slate-200">
                      {item.label}
                    </span>
                  </div>
                  <span className="ml-2 text-xs font-semibold text-cyan-300 shrink-0">
                    {item.value} ({percent}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </ChartModal>
    </>
  );
}
