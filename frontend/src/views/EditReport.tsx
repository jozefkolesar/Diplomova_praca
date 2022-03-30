import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ISingleReport } from "../models/edit-reports";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const EditReport = () => {
  const params = useParams<{ id: string }>();
  const [report, setReport] = useState<ISingleReport>();

  const navigate = useNavigate();

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${window.localStorage.getItem("token")}`
    );

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    fetch(`http://localhost:4000/api/reports/${params.id}`, requestOptions)
      .then((response) => response.json())
      .then((result: ISingleReport) => setReport(result));
    // eslint-disable-next-line
  }, []);

  const updateState = (status: string) => () => {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${window.localStorage.getItem("token")}`
    );
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      status: status,
    });

    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
    };

    fetch(`http://localhost:4000/api/reports/${params.id}`, requestOptions)
      .then((response) => response.text())
      .then(() => navigate("/neucasti"));
  };

  console.log(report);

  return (
    <div>
      <h1>Nahlásenie</h1>
      <p>
        <b>Meno:</b> {report?.data.data.user.name}
      </p>
      <p>
        <b>Dátum nahlásenia:</b>{" "}
        {new Date(report?.data.data.createdAt!).toLocaleDateString("sk")}
      </p>
      <p>
        <b>Predmet:</b> {report?.data.data.course}
      </p>
      <p>
        <b>Dátum neúčasti:</b>{" "}
        {new Date(report?.data.data.dayOfAbsence!).toLocaleDateString("sk")}
      </p>
      <p>
        <b>Dôvod neúčasti:</b> {report?.data.data.description}
      </p>

      <img
        src={report?.data.data.photo}
        alt="Neúčasť"
        height="100"
        width="100"
      />

      {report && (
        <Map
          initialViewState={{
            longitude: report.data.data.long,
            latitude: report.data.data.lat,
            zoom: 14,
          }}
          style={{ width: 600, height: 400 }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken="pk.eyJ1IjoiamtvbGVzYXIiLCJhIjoiY2t6MnZyOXA4MDB1ZzJwcGQ2amQyYjFwYSJ9.BYHDHQ8PEfwGVpr3VC8Brw"
        >
          <Marker
            longitude={report.data.data.long}
            latitude={report.data.data.lat}
            anchor="bottom"
          />
        </Map>
      )}

      {report?.data.data.status === "nevyriesena" && (
        <>
          <Button
            variant="contained"
            color="success"
            onClick={updateState("akceptovana")}
          >
            Akceptovať
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={updateState("odmietnuta")}
          >
            Odmietnúť
          </Button>
        </>
      )}
    </div>
  );
};

export default EditReport;
