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
      <h2 className="text-center">Sample SVG rendering using d3.js</h2>
      <MDBContainer
        style={{
          background: "url(http://i.stack.imgur.com/GySvQ.png)",
        }}
      >
        <svg
          width="100%"
          height="100%"
          ref={ref}
          viewBox="0 0 100 50"
          stroke-width="0.3"
          stroke="black"
          fill="none"
        ></svg>
      </MDBContainer>
    </NavigationLayout>
  );
};

export default BasicD3Shape;
