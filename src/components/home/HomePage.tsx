import React from "react";
import NavigationLayout from "../NavigationLayout";

const HomePage = () => {
  return (
    <NavigationLayout>
      <h2 className="mt-5 mb-5">React D3 Visualizations</h2>
      <p className="text-monospace">
        View a variety of graphs and charts composed by d3.js and React hooks.
        The source code can be found in my github repo{" "}
        <a
          href="https://github.com/dong-alex/d3-data-visualizer"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
        . I use a variety of datasets including randomly generated data to
        create the visualizations in different ways.
      </p>
      <p className="text-monospace">
        This is all a learning experience, specifically geared towards d3.js,
        SVGs, and visualizations in general. Each graph/chart will have concepts
        newly learned or reviewed upon, built up overtime.
      </p>
      <p className="text-monospace">
        This project was developed using CRA and TypeScript.
      </p>
    </NavigationLayout>
  );
};

export default HomePage;
