import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import ChartCard from "../../layout/ChartCard";
import ChartModal from "../common/ChartModel";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";

const api = `${import.meta.env.VITE_BACKEND_URL}/data/topic-distribution`;

export default function TopicTrendChart() {
  const ref = useRef();
  const modalRef = useRef();
  const tooltipRef = useRef();
  const modalTooltipRef = useRef();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios.get(api).then(res => setData(res.data));
  }, []);

  const draw = (svgRef, tooltipNode, w, h) => {
    if (!svgRef || !data.length) return;

    const width = w || 900;
    const height = h || 360;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    const svg = d3.select(svgRef);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const x = d3.scalePoint()
      .domain(data.map(d => d.label))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x(d => x(d.label))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    // Glow effect
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", `glow-${Math.random()}`);
    filter.append("feGaussianBlur")
      .attr("stdDeviation", 4)
      .attr("result", "blur");
    const merge = filter.append("feMerge");
    merge.append("feMergeNode").attr("in", "blur");
    merge.append("feMergeNode").attr("in", "SourceGraphic");

    // Line
    const path = svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#6366f1")
      .attr("stroke-width", 4)
      .attr("filter", `url(#glow-${Math.random()})`)
      .attr("d", line);

    // Animation
    const totalLength = path.node().getTotalLength();
    path
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1600)
      .ease(d3.easeCubicOut)
      .attr("stroke-dashoffset", 0);

    // Dots
    svg.selectAll("circle.dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.label))
      .attr("cy", d => y(d.value))
      .attr("r", 5)
      .attr("fill", "#22c55e");

    // Axes
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-20)")
      .style("text-anchor", "end");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Interaction Layer
    const overlay = svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "transparent");

    // Hover Dot (ONLY DOT — NO VERTICAL LINE)
    const focusDot = svg.append("circle")
      .attr("r", 9)
      .attr("fill", "#38bdf8")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("opacity", 0);

    const tooltip = d3.select(tooltipNode);

    overlay
      .on("mousemove", (event) => {
        const [mx] = d3.pointer(event);

        const index = d3.leastIndex(data, d =>
          Math.abs(x(d.label) - mx)
        );

        const d = data[index];
        if (!d) return;

        const cx = x(d.label);
        const cy = y(d.value);

        focusDot
          .attr("cx", cx)
          .attr("cy", cy)
          .style("opacity", 1);

        tooltip
          .style("opacity", 1)
          .style("left", `${cx + 15}px`)
          .style("top", `${cy - 15}px`)
          .html(`
            <div class="font-semibold">${d.label}</div>
            <div class="text-cyan-400">Value: ${d.value}</div>
          `);
      })
      .on("mouseleave", () => {
        focusDot.style("opacity", 0);
        tooltip.style("opacity", 0);
      });
  };

  useEffect(() => {
    if (!data.length) return;
    draw(ref.current, tooltipRef.current);
  }, [data]);

  useEffect(() => {
    if (open && modalRef.current) {
      const svg = d3.select(modalRef.current).select("svg");
      const rect = modalRef.current.getBoundingClientRect();
      draw(svg.node(), modalTooltipRef.current, rect.width, rect.height - 40);
    }
  }, [open, data]);

  return (
    <>
      <ChartCard 
        title="📈 Topic Trend Analytics (Interactive)"
        action={
          <ArrowsPointingOutIcon 
            onClick={() => setOpen(true)}
            className="w-5 h-5 cursor-pointer hover:text-cyan-400" 
          />
        }
      >
        <div className="relative w-full h-full overflow-hidden">
          <svg ref={ref} className="w-full h-full max-w-full block" />

          {/* Tooltip */}
          <div
            ref={tooltipRef}
            className="absolute pointer-events-none bg-slate-900/90 text-white text-xs px-3 py-2 rounded-lg shadow-xl border border-cyan-400 transition"
            style={{ opacity: 0 }}
          />
        </div>
      </ChartCard>

      <ChartModal open={open} onClose={() => setOpen(false)}>
        <div ref={modalRef} className="w-full h-full relative overflow-hidden">
          <svg className="w-full h-full max-w-full block" />

          {/* Tooltip */}
          <div
            ref={modalTooltipRef}
            className="absolute pointer-events-none bg-slate-900/90 text-white text-xs px-3 py-2 rounded-lg shadow-xl border border-cyan-400 transition"
            style={{ opacity: 0 }}
          />
        </div>
      </ChartModal>
    </>
  );
}
