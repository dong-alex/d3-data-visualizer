import React, { useState, useEffect, useRef, FunctionComponent } from "react";
import * as d3 from "d3";
import NavigationLayout from "../NavigationLayout";
import { MDBContainer } from "mdbreact";

const CLIENT_ID =
  "82265098969-1r4hked0o8ga6gbvdfbsrfriigjodeln.apps.googleusercontent.com";
const API_KEY = "AIzaSyDBHs57eFNSQsiTit2RlGHl4MDUrbIlmBo";
const DISCOVERY_DOCS = [
  "https://sheets.googleapis.com/$discovery/rest?version=v4",
];
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

export type JobData = {
  company: string;
  status: string;
  location: string;
};

enum Status {
  Submitted = 0,
  Rejected = 1,
  Offer = 2,
  Phone = 3,
}

const JobApplicationPieChart: FunctionComponent<{}> = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const ref = useRef(null);
  const [data, setData] = useState<{ status: string; count: number }[]>([]);

  useEffect(() => {
    const script: HTMLScriptElement = document.createElement("script");
    script.src = "https://apis.google.com/js/client.js";
    script.onload = () => {
      gapi.load("client:auth2", initClient);
    };
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (data) {
      const group = d3.select(ref.current);
      const pie: any = d3
        .pie()
        .padAngle(0.005)
        .sort(null)
        .value((d: any) => d.count);

      // parse the data to more usable details - such as submitted and rejected enums
      const colors = d3.scaleOrdinal(d3.schemeCategory10);

      const arcLabel: any = () => {
        const radius = Math.min(300, 300) / 2;
        return d3
          .arc()
          .innerRadius(radius * 0.67)
          .outerRadius(radius - 1);
      };

      const arcs = pie(data);

      group
        .selectAll("path")
        .data(arcs)
        .join("path")
        .attr("fill", (d, i) => colors(i.toString()))
        .attr("d", arcLabel())
        .append("title")
        .text((d: any) => `${d.data.status}: ${d.data.count.toLocaleString()}`);

      group
        .append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 16)
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(arcs) // per arcs, append a g element with a text element
        .join("text")
        .attr("transform", (d: any) => `translate(${arcLabel().centroid(d)})`) // rorate the text elements based on the center of the arc that was drawn
        .call((text: any) =>
          text
            .filter((d: any) => d.endAngle - d.startAngle > 0.25)
            .append("tspan") // give a text span of the status
            .attr("y", "-0.4em")
            .text((d: any) => d.data.status)
        )
        .call((text: any) =>
          text
            .filter((d: any) => d.endAngle - d.startAngle > 0.25) // filter all entities with an angle greater than 0.25 rads
            .append("tspan") // give a text span of the count of applications
            .attr("x", 0)
            .attr("y", "0.7em")
            .attr("fill-opacity", 0.7)
            .text((d: any) => d.data.count.toLocaleString())
        );
    }
  }, [data]);

  const initClient = () => {
    gapi.client
      .init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })
      .then(() => {
        setLoading(false);
        getApplications();
      });
  };

  const getApplications = () => {
    gapi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: "1ELzmT3kjB90-04hE6kMSHKlhssfgBw85xcmJfDtYi6E",
        range: "Job Applications!A2:E",
      })
      .then((response) => {
        var range = response.result;
        if (range && range.values) {
          if (range.values.length > 0) {
            const applications: JobData[] = [];
            range.values.forEach((row) => {
              const [company, _, location, __, status] = row;
              applications.push({ company, location, status });
            });

            const enumData: Map<string, number> = new Map();
            applications.forEach(({ status }: JobData) => {
              const value = enumData.get(status);
              if (value) {
                enumData.set(status, value + 1);
              } else {
                enumData.set(status, 1);
              }
            });

            // group the categories by submitted, rejected and others
            // const pieData = d3.pie(enumData);
            const array: { status: string; count: number }[] = [];

            enumData.forEach((value, key) => {
              array.push({ status: key, count: value });
            });

            setData(array);
          }
        }
      });
  };

  return (
    <NavigationLayout>
      <div>
        <h2 className="mt-5 mb-5">Job Application Visualizer</h2>
        <p className="text-monospace">
          A pie chart using Google Sheets API that pulls data about my job
          applications.
        </p>
        {!loading && (
          <MDBContainer
            style={{
              background: "url(http://i.stack.imgur.com/GySvQ.png)",
            }}
          >
            <svg
              ref={ref}
              height="300px"
              width="300px"
              viewBox="-150 -150 300 300"
            />
          </MDBContainer>
        )}
      </div>
    </NavigationLayout>
  );
};

export default JobApplicationPieChart;