import "./styles/App.css";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import InfoBox from "./components/InfoBox";
import Map from "./components/Map";
import Table from "./components/Table";
import LineGraph from "./components/LineGraph";
import { sortData, rootApiUrl } from "./util";
function App() {
  const [countries, setCountries] = useState(["USA", "UK", "RUSSIA"]);
  const [country, setCountry] = useState("worldwide");
  const [mapCountries, setMapCountries] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 34.80746,
    lng: -40.478,
  });
  const [zoom, setZoom] = useState(2);
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  

  useEffect(() => {
    fetch(`${rootApiUrl}/all`)
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountries = async () => {
      await fetch(`${rootApiUrl}/countries`)
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
            id: country.countryInfo._id,
          }));
          
          const sortedData = sortData(data);
          setMapCountries(sortedData);
          console.log(mapCountries);
          setCountries(countries);
          setTableData(sortedData);
          
        });
    };

    getCountries();
  }, []); //ensure code will be executed only once when component was loaded

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    const apiParams =
      countryCode === "worldwide" ? "/all" : `/countries/${countryCode}`;

    await fetch(rootApiUrl + apiParams)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setZoom(4);
      });
  };
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker App</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem key={country.name} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            title="COVID-19 Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBox
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <InfoBox
            title="Death"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>
        <div className="app__map">
          <Map countries={mapCountries} center={mapCenter} zoom={zoom} />
        </div>
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
        </CardContent>
        <CardContent>
          <h3>Worldwide new cases</h3>
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
