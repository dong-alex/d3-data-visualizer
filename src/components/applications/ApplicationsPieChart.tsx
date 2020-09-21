import React, { useState, useEffect, useRef, FunctionComponent } from "react";
import useInterval from "../useInterval";
import NavigationLayout from "../NavigationLayout";
import * as d3 from "d3";
import { MDBContainer } from "mdbreact";
import { Arc, DefaultArcObject } from "d3";

type ApplicationPieChartProps = {
  data: any;
};

const ApplicationPieChart: FunctionComponent<ApplicationPieChartProps> = ({
  data,
}) => {
  const generateData = (value?: number, length = 5) =>
    d3.range(length).map((item, index) => ({
      date: index,
      value:
        value === null || value === undefined ? Math.random() * 100 : value,
    }));
  const pieData: any = d3
    .pie()
    .value((d: any) => d.value)
    .sort(null);
  const [dataset, setDataset] = useState<any[]>(generateData());
  const ref = useRef(null);
  const createArc: any = d3.arc().innerRadius(0).outerRadius(100);
  const colors = d3.scaleOrdinal(d3.schemeCategory10);
  const format = d3.format(".2f");

  useEffect(() => {
    const group = d3.select(ref.current);
    // selectAll g.arc with the pie data - enter/update/exit
    // enter: any new data (initial render is all enter)
    // update: any current data and new data
    // exit: data no longer necessary - remove them

    const groupWithData = group.selectAll("g.arc").data(pieData(dataset));
    groupWithData.exit().remove(); // remove the exit data
    const groupWithUpdate = groupWithData
      .enter()
      .append("g")
      .attr("class", "arc");

    const path = groupWithUpdate
      .append("path")
      .merge(groupWithData.select("path.arc"));

    path
      .attr("class", "arc")
      .attr("d", createArc)
      .attr("fill", (d, i) => colors(i.toString()));

    const text = groupWithUpdate
      .append("text")
      .merge(groupWithData.select("text"));

    text
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("transform", (d) => `translate(${createArc.centroid(d)})`)
      .style("fill", "white")
      .style("font-size", 10)
      .text((d: any) => format(d.value));
  }, [dataset]);

  // viewbox : min-x, min-y, height, width
  // SVG scales up or down
  return (
    <NavigationLayout>
      <h2 className="text-center">Application Pie Chart using d3.js</h2>
      <svg height="500px" width="100%" viewBox="0 0 300 300">
        <g ref={ref} transform={`translate(150, 150)`} />
      </svg>
    </NavigationLayout>
  );
};

export default ApplicationPieChart;
