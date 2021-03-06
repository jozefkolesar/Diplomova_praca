import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ISingleReport } from "../models/edit-reports";
import "mapbox-gl/dist/mapbox-gl.css";
import "./EditReport.scss";
import { useSnackbar } from "notistack";
import RoomIcon from "@mui/icons-material/Room";
import GoogleMapReact from "google-map-react";

const LocationPin = (props: { lat: number; lng: number }) => (
  <div className="pin">
    <RoomIcon htmlColor="red" fontSize="large" />
  </div>
);

const EditReport = () => {
  const params = useParams<{ id: string }>();
  const [report, setReport] = useState<ISingleReport>();

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${window.localStorage.getItem("token")}`
    );
    myHeaders.append("Cookie", `jwt=${window.localStorage.getItem("token")}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    fetch(
      `https://nahlasovanie-neucasti-app.herokuapp.com/api/reports/${params.id}`,
      requestOptions
    )
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
    myHeaders.append("Cookie", `jwt=${window.localStorage.getItem("token")}`);

    var raw = JSON.stringify({
      status: status,
    });

    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
    };

    fetch(
      `https://nahlasovanie-neucasti-app.herokuapp.com/api/reports/${params.id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          if (status === "akceptovana") {
            enqueueSnackbar("Nahl??senie bolo akceptovan??", {
              variant: "success",
            });
            navigate("/neucasti");
          } else {
            enqueueSnackbar("Nahl??senie nebolo uznan??", { variant: "success" });
            navigate("/neucasti");
          }
        }
      });
  };

  return (
    <div className="edit-report-container">
      <h1>Nahl??senie</h1>
      <div>
        <p>
          <b>Meno:</b> {report?.data.data.user.name}
        </p>
        <p>
          <b>D??tum nahl??senia:</b>{" "}
          {new Date(report?.data.data.createdAt!).toLocaleDateString("sk")}
        </p>
        <p>
          <b>Predmet:</b> {report?.data.data.course}
        </p>
        <p>
          <b>D??tum ne????asti:</b>{" "}
          {new Date(report?.data.data.dayOfAbsence!).toLocaleDateString("sk")}
        </p>
        <p>
          <b>Z??kladn?? d??vod</b> {report?.data.data.selectDesc}
        </p>
        <p>
          <b>D??vod ne????asti:</b> {report?.data.data.description}
        </p>
      </div>

      {report?.data.data.photo && (
        <img
          className="report-image"
          src={report?.data.data.photo}
          alt="Ne????as??"
        />
      )}

      {report && (
        <div style={{ height: 400, width: "50%", minWidth: 300 }}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: "AIzaSyDOPN7JplFKBGQeHn2ISjO-vrH3K3VDsOU",
            }}
            defaultCenter={{
              lat: report.data.data.lat,
              lng: report.data.data.long,
            }}
            defaultZoom={15}
          >
            <LocationPin
              lat={report.data.data.lat}
              lng={report.data.data.long}
            ></LocationPin>
          </GoogleMapReact>
        </div>
      )}

      {report?.data.data.status === "nevyriesena" && (
        <>
          <Button
            variant="contained"
            color="success"
            onClick={updateState("akceptovana")}
          >
            Akceptova??
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={updateState("neuznana")}
          >
            Odmietn????
          </Button>
        </>
      )}
    </div>
  );
};

export default EditReport;
