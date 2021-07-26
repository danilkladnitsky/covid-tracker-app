import React from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";
import { useState, useEffect } from "react";
import { rootApiUrl, graphOptions} from "../util";

function LineGraph({ casesType = "cases" }) {
  const [data, setData] = useState({});

  const buildChartData = (data, casesType = "cases") => {
    const chartData = [];
    let lastDataPoint;

    for (let date in data.cases) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }

    return chartData;
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetch(`${rootApiUrl}/historical/all?lastdays=120`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const chartData = buildChartData(data, "cases");
          setData(chartData);
        });
    };

    fetchData();
  }, [casesType]);

  return (

    <div>
      
      {data?.length > 0 && (
        <Line
          options={graphOptions}
          data={{
            datasets: [
              {
                backgroundColor: "whitesmoke",
                borderColor: "#CC1034",
                data: data,
              },
            ],
          }}
        ></Line>
      )}
    </div>
  );
}

export default LineGraph;

