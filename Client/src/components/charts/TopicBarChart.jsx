import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import ChartCard from "../../layout/ChartCard";
import ChartModal from "../common/ChartModel";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";

const api = `${import.meta.env.VITE_BACKEND_URL}/data/topic-distribution`;

export default function TopicBarChart() {
  const ref = useRef();
  const modalRef = useRef();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios.get(api).then(res => setData(res.data));
  }, []);

  const draw = (svgRef, w, h) => {
    if (!svgRef || !data.length) return;

    const margin = { top: 20, right: 30, bottom: 30, left: 160 };

    const svg = d3.select(svgRef);
    svg.selectAll("*").remove();
    svg.attr("width", w).attr("height", h);

    const y = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([margin.top, h - margin.bottom])
      .padding(0.25);

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .nice()
      .range([margin.left, w - margin.right]);

    svg.append("g")
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", margin.left)
      .attr("y", d => y(d.label))
      .attr("height", y.bandwidth())
      .attr("rx", 6)
      .attr("width", 0)
      .attr("fill", "#6366f1")
      .transition()
      .duration(1200)
      .attr("width", d => x(d.value) - margin.left);

    svg.append("g")
      .attr("transform", `translate(0,${h - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  };

  useEffect(() => {
    if (!data.length) return;
    draw(ref.current, 900, 360);
  }, [data]);

  useEffect(() => {
    if (open && modalRef.current) {
      const svg = d3.select(modalRef.current).select("svg");
      const rect = modalRef.current.getBoundingClientRect();
      draw(svg.node(), rect.width, rect.height - 40);
    }
  }, [open, data]);

  return (
    <>
      <ChartCard 
        title="📌 Topic Distribution (Horizontal Bar)"
        action={
          <ArrowsPointingOutIcon 
            onClick={() => setOpen(true)}
            className="w-5 h-5 cursor-pointer hover:text-cyan-400" 
          />
        }
      >
        <div className="w-full h-full overflow-hidden">
          <svg ref={ref} className="w-full h-full max-w-full block" style={{ display: 'block' }} />
        </div>
      </ChartCard>

      <ChartModal open={open} onClose={() => setOpen(false)}>
        <div ref={modalRef} className="w-full h-full overflow-hidden">
          <svg className="w-full h-full max-w-full block" style={{ display: 'block' }} />
        </div>
      </ChartModal>
    </>
  );
}
