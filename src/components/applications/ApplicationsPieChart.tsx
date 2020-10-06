import React, { useState, useEffect, useRef, FunctionComponent } from "react";
import NavigationLayout from "../NavigationLayout";
import * as d3 from "d3";
import { MDBContainer } from "mdbreact";

type ApplicationPieChartProps = {
  data: any;
};

const createArc: any = d3.arc().innerRadius(0).outerRadius(100);
const colors = d3.scaleOrdinal(d3.schemeCategory10);
const format = d3.format(".2f");
const pieData: any = d3
  .pie()
  .value((d: any) => d.value)
  .sort(null);

const ApplicationPieChart: FunctionComponent<ApplicationPieChartProps> = ({
  data,
}) => {
  const generateData = (value?: number, length = 5) =>
    d3.range(length).map((item, index) => ({
      date: index,
      value:
        value === null || value === undefined ? Math.random() * 100 : value,
    }));

  const [dataset, setDataset] = useState<any[]>([]);
  const ref = useRef(null);

  useEffect(() => {
    setDataset(generateData());
  }, []);

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
      <h2 className="mt-5 mb-5">Application Pie Chart using d3.js</h2>
      <p className="text-monospace">
        A pie chart using random data during each visit.
      </p>
      <p className="text-monospace">Learning experiences:</p>
      <ul>
        <li>
          <code>(d3.Selection).exit().remove()</code> will remove any of the old
          data previously contained and returns it. Similar to popping items out
          of lists, it returns the elements removed.
        </li>
        <li>
          <code>.pie.value(...)</code> will invoke a function per value in an
          array of data.
        </li>
        <li>
          You can include classes within the elements you select i.e.{" "}
          <code>.selectAll("g.arc")</code> would generate per data point, a
          group SVG element with the <code>className="arc"</code>
        </li>
        <li>
          <code>d3.arc().innerRadius(...).outerRadius(...)</code> creates the
          coordinates required to generate a part of the pie chart with the{" "}
          <code>path</code> element. A sample of the value created can be{" "}
          <code>
            M-87.99594792644156,47.50487499748829A100,100,0,0,1,-1.8369701987210297e-14,-100L0,0Z
          </code>
        </li>
        <li>
          You can setup the height of the SVG canvas. The current example is
          500px with the width at 100%. Viewbox in the height/width can dictate
          the 'size' of the element based on zoom. Transformation of the
          elements like 'g' can use the viewBox height/width as a guideline to
          'center' the element in the SVG canvas. Use the grid to visualize the
          container with the SVG element with the same dimensions.
        </li>
      </ul>
      <MDBContainer
        style={{
          background: "url(http://i.stack.imgur.com/GySvQ.png)",
        }}
      >
        <svg height="500px" width="100%" viewBox="0 0 300 300">
          <g ref={ref} transform={`translate(150, 150)`} />
        </svg>
      </MDBContainer>
    </NavigationLayout>
  );
};

export default ApplicationPieChart;
