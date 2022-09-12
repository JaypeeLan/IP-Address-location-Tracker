import { useLayoutEffect, useState, useRef } from "react";
import axios from "axios";
import "./details.css";
import "./search.css";
import arrowIcon from "../images/icon-arrow.svg";

import "./map.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import icon from "../images/icon-location.svg";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const Details = () => {
  // To get the search value
  const searchValue = useRef();

  var apiKey = "at_xjVSenAYLEtWKI39bo1kvNs1tGK5s"
  // To make the search value global
  var searchVal;
  // ------------------------------------------------------------------------------------------/-/

  // The icon that show your location on the map
  const markerIcon = new L.icon({
    iconUrl: icon,
    iconRetinaUrl: icon,
    iconSize: [35, 45],
  });

  // -----------------------------------------------------------------------//
  // The state of all the info needed from the location api
  const [ipAdd, setIpAdd] = useState(null);
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [time, setTime] = useState("");
  const [isp, setIsp] = useState("");
  const [postalCode, setPostalcode] = useState("");
  const [userLat, setUseLat] = useState("");
  const [userLng, setUseLng] = useState("");

  //----------------------------------------------------------------------//
  // To update all the states after the Api is fetched
  var searchResult = (data) => {
    setIpAdd(data?.ip);
    setCity(data.location.city);
    setRegion(data.location.region);
    setPostalcode(data.location.postalCode);
    setIsp(data.isp);
    setTime(data.location.timezone);
    setUseLat(data.location.lat);
    setUseLng(data.location.lng);
  };

  // ----------------------------------------------------------------//
  // to fecth the search value details from the api when the enter key is pressed
  let handleKey = (e) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

  // -------------------------------------------------------------------------------------//
  // to fecth the search value details from the api
  var handleClick = () => {
    searchVal = searchValue.current.value;
    axios
      .get(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${searchVal}&domain=${searchVal}`
      )
      .then((res) => {
        const data = res.data;
        return data;
      })
      .then(searchResult)
      .catch((error) => {
        alert("Error: " + error.message);
      });
  };

  //---------------------------------------------------------------------//
  // To load the Visitor details once the page load
  useLayoutEffect(() => {
    axios
      .get(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=&domain=`
      )
      .then((res) => {
        const data = res.data;
        return data;
      })
      .then(searchResult)
      .catch((error) => {
        alert("Error: " + error.message);
      });
  }, []);

  //----------------------------------------------------------------------//
  // Latitude and longitude from the location api used to view the user location on the map

  const center = [userLat, userLng];

  // -----------------------------------------------------------------------//

  return (
    <>
      <div id="search">
        <h1>IP Address Tracker</h1>

        <div>
          <label htmlFor="search">
            <input
              type="text"
              name="search"
              id="searchBox"
              placeholder="Search for any IP address or domain"
              ref={searchValue}
              onKeyPress={handleKey}
            />

            <span
              id="iconWrapper"
              onClick={handleClick}
              style={{ backgroundColor: "black", width: "fit-content" }}
            >
              <img src={arrowIcon} alt="search" />
            </span>
          </label>
        </div>
      </div>
      {/*  -------------------------------------------------------------------- */}

      <div id="searchDetails">
        {ipAdd && (
          <>
            <div>
              <h2>IP Address </h2>
              <p>{ipAdd} </p>
            </div>
            {/* ---------------------- */}
            <div>
              <h2> Location </h2>
              <p>
                {city}, {region} {postalCode}
              </p>
            </div>
            {/* --------------------------- */}
            <div>
              <h2>Timezone </h2>
              <p> UTC {time} </p>
            </div>
            {/* -------------------------------- */}
            <div>
              <h2>ISP </h2>
              <p> {isp} </p>
            </div>
          </>
        )}
      </div>
      {/* ------------------------------------ */}

      <MapContainer
        style={{ overflow: "hidden", height: "100%" }}
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        key={`${userLat}${userLng}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center} icon={markerIcon}>
          <Popup>My location</Popup>
        </Marker>
      </MapContainer>
    </>
  );
};

export default Details;
