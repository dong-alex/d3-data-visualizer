import React, { useState, useEffect, useRef } from "react";
import useInterval from "../useInterval";
import NavigationLayout from "../NavigationLayout";
import * as d3 from "d3";
import { MDBContainer } from "mdbreact";

const BasicD3Shape = () => {
  const generateDataset = (): number[][] => {
    return Array(10)
      .fill(0)
      .map(() => [Math.random() * 80 + 10, Math.random() * 35 + 10]);
  };

  const [dataset, setDataset] = useState<number[][]>(generateDataset());
  const ref = useRef(null);

  useEffect(() => {
    const svgElement = d3.select(ref.current);
    svgElement
      .selectAll("circle")
      .data(dataset)
      .join("circle")
      .attr("cx", (d) => d[0])
      .attr("cy", (d) => d[1])
      .attr("r", 3);
  }, [dataset]);

  useInterval(() => {
    const newData = generateDataset();
    setDataset(newData);
  }, 2000);

  // viewbox : min-x, min-y, height, width
  return (
    <NavigationLayout>
      <h2 className="mt-5 mb-5">Sample SVG Rendering</h2>
      <p className="text-monospace">
        A simple SVG that generates random circles based on a set of random data
        points that reset every 2 seconds.
      </p>
      <p className="text-monospace">
        A quick list of concepts that were gone over:
      </p>
      <ul>
        <li>
          Set a reference via useRef to let d3.js know where to create the
          elements. i.e. <code>d3.select(ref.current)</code>
        </li>
        <li>
          Enter/Update/Exit via{" "}
          <code>d3.select(ref.current).selectAll("circle").data(data)</code>{" "}
          'Enter' represents new data from the SVG canvas (initally empty).
          'Update' changes current data that still exists. 'Exit' removes data
          that are old.
        </li>
        <li>
          <code>.attr</code> is used based on the type of element you are
          creating. For a circle you would require 'cx', 'cy', and 'r'. They
          represent coordinate X, coordinate Y, and radius respectively.
        </li>
      </ul>
      <MDBContainer
        style={{
          background: "url(http://i.stack.imgur.com/GySvQ.png)",
        }}
      >
        <svg
          ref={ref}
          viewBox="0 0 100 50"
          stroke-width="0.3"
          stroke="black"
          fill="none"
        />
      </MDBContainer>
    </NavigationLayout>
  );
};

export default BasicD3Shape;
