import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import ChartCard from "../../layout/ChartCard";
import ChartModal from "../common/ChartModel";
import useChartDimensions from "../../hooks/useChartDimensions";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";

const api = `${import.meta.env.VITE_BACKEND_URL}/data/intensity-distribution`;

export default function PieChart() {
  const containerRef = useRef();
  const modalRef = useRef();
  const tooltipRef = useRef();
  const modalTooltipRef = useRef();

  const { width, height } = useChartDimensions(containerRef);
  const modalSize = useChartDimensions(modalRef);

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios.get(api).then((res) => {
      const processed = res.data.slice(0, 8).map((d) => ({
        label: d._id,
        value: +d.value,
      }));
      setData(processed);
    }).catch(() => {
      // Fallback data if API fails
      setData([
        { label: "Critical", value: 2890 },
        { label: "High", value: 1200 },
        { label: "Medium", value: 3908 },
        { label: "Low", value: 4800 },
      ]);
    });
  }, []);

  const draw = (ref, w, h) => {
    if (!ref || !data.length) return;

    const svg = d3.select(ref).select("svg")
      .attr("width", w)
      .attr("height", h);

    svg.selectAll("*").remove();

    const radius = Math.min(w, h) / 2 - 40;
    const g = svg.append("g")
      .attr("transform", `translate(${w / 2},${h / 2})`);

    const pie = d3.pie()
      .value((d) => d.value)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(radius * 0.4)
      .outerRadius(radius);

    const color = d3.scaleOrdinal()
      .domain(data.map((d) => d.label))
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

    const tooltip = d3.select(tooltipRef.current);
    const arcHover = d3.arc()
      .innerRadius(radius * 0.4)
      .outerRadius(radius + 10);

    g.selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("fill", (d) => color(d.data.label))
      .attr("d", arc)
      .attr("stroke", "#020617")
      .attr("stroke-width", 2)
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("d", arcHover);

        const total = d3.sum(data, (item) => item.value);
        const percent = ((d.data.value / total) * 100).toFixed(1);

        tooltip
          .style("opacity", 1)
          .style("left", event.offsetX + 15 + "px")
          .style("top", event.offsetY - 20 + "px")
          .html(`
            <div class="font-semibold">${d.data.label}</div>
            <div class="text-cyan-400">Value: ${d.data.value}</div>
            <div class="text-green-400">${percent}%</div>
          `);
      })
      .on("mouseout", function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("d", arc);

        tooltip.style("opacity", 0);
      })
      .transition()
      .duration(1200)
      .attr("d", arc);

    // Add labels
    g.selectAll("text")
      .data(pie(data))
      .enter()
      .append("text")
      .attr("transform", (d) => `translate(${arcHover.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", "#fff")
      .attr("font-size", "12px")
      .attr("font-weight", "600")
      .text((d) => `${((d.data.value / d3.sum(data, (item) => item.value)) * 100).toFixed(0)}%`);
  };

  useEffect(() => {
    if (width && height && data.length) {
      draw(containerRef.current, width, height);
    }
  }, [width, height, data]);

  useEffect(() => {
    if (modalSize.width && modalSize.height && open && data.length) {
      draw(modalRef.current, modalSize.width, modalSize.height - 60);
    }
  }, [modalSize, open, data]);

  return (
    <>
      <ChartCard
        title="🥧 Intensity Distribution (Pie)"
        action={
          <ArrowsPointingOutIcon
            onClick={() => setOpen(true)}
            className="w-5 h-5 cursor-pointer hover:text-cyan-400"
          />
        }
      >
        <div ref={containerRef} className="relative w-full h-full overflow-hidden">
          <svg className="w-full h-full max-w-full block" style={{ display: "block" }} />

          <div
            ref={tooltipRef}
            className="pointer-events-none absolute z-10 rounded-lg border border-white/20 bg-slate-900/95 px-3 py-2 text-xs text-slate-100 shadow-2xl"
            style={{ opacity: 0 }}
          />
        </div>
      </ChartCard>

      <ChartModal open={open} onClose={() => setOpen(false)}>
        <div ref={modalRef} className="w-full h-full overflow-hidden relative">
          <svg className="w-full h-full" style={{ display: "block", minHeight: "400px" }} />

          <div
            ref={modalTooltipRef}
            className="pointer-events-none absolute z-10 rounded-lg border border-white/20 bg-slate-900/95 px-3 py-2 text-xs text-slate-100 shadow-2xl"
            style={{ opacity: 0 }}
          />
        </div>
      </ChartModal>
    </>
  );
}
