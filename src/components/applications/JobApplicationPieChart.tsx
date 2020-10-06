import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  FunctionComponent,
} from "react";
import * as d3 from "d3";
import NavigationLayout from "../NavigationLayout";
import { MDBContainer } from "mdbreact";

const DISCOVERY_DOCS = [
  "https://sheets.googleapis.com/$discovery/rest?version=v4",
];
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

export type JobData = {
  company: string;
  status: string;
  location: string;
  position: string;
  link: string;
};

const JobApplicationPieChart: FunctionComponent<{}> = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const ref = useRef(null);
  const [data, setData] = useState<{ status: string; count: number }[]>([]);

  const initClient = useCallback(() => {
    gapi.client
      .init({
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })
      .then(() => {
        setLoading(false);
        getApplications();
      });
  }, []);

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
              const [company, position, location, link, status] = row;
              applications.push({ company, location, status, position, link });
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

  useEffect(() => {
    const script: HTMLScriptElement = document.createElement("script");
    script.src = "https://apis.google.com/js/client.js";
    script.onload = () => {
      gapi.load("client:auth2", initClient);
    };
    document.body.appendChild(script);
  }, [initClient]);

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

  return (
    <NavigationLayout>
      <div>
        <h2 className="mt-5 mb-5">Job Application Visualizer</h2>
        <p className="text-monospace">
          A pie chart using Google Sheets API that pulls data about my job
          applications.
        </p>
        <p className="text-monospace">Learning experiences:</p>
        <ul>
          <li>
            <code>(text).call</code> is similar to the map function for arrays,
            you can filter them based on their internal attributes i.e.
            transforms
          </li>
          <li>
            <code>.path</code> traces based on what d3.js object is drawn i.e.
            arcs
          </li>
          <li>
            Access the data objects via <code>d.data.[objectName]</code>.
            Function calls would call it for every value unless you filter it
            based on some spec. In this example, small angles in the pi chart is
            neglected and no text is given.
          </li>
        </ul>
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
