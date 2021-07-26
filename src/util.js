import { numeral } from "numeral";

import { Circle, Popup } from "react-leaflet";
export const rootApiUrl = "https://disease.sh/v3/covid-19";

export const sortData = (data) => {
  return [...data].sort((a, b) => (a.cases > b.cases ? -1 : 1));
};

export const showDataOnMap = (data, casesType = "cases") => {
  return data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      color={casesTypeColors[casesType].hex}
      fillColor={casesTypeColors[casesType].hex}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
      fillOpacity={0.4}
    >
      <Popup>
        <div className="popup__stat">
          <img src={country.countryInfo.flag} alt={country.country} />
          <h3>{country.country}</h3>
          <div>Cases: {country.cases}</div>
          <div>Recovered: {country.recovered}</div>
          <div>Death: Cases: {country.deaths}</div>
          <div></div>
        </div>
      </Popup>
    </Circle>
  ));
};

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    multiplier: 200,
  },
  recovered: {
    hex: "#7dd71d",
    multiplier: 400,
  },
  deaths: {
    hex: "#fb4443",
    multiplier: 800,
  },
};

export const graphOptions = {
  plugins: {
    legend: {
      display: false,
    },
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};
