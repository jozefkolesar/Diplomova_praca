import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IEditReports } from "../models/edit-reports";

const EditReports = () => {
  const [reports, setReports] = useState<IEditReports>();

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

    fetch("http://localhost:4000/api/reports/pending-reports", requestOptions)
      .then((response) => response.json())
      .then((result: IEditReports) => setReports(result));
  }, []);

  const openEditReport = (id: string) => () => {
    navigate(`/schvalenie/${id}`);
  };

  return (
    <div>
      {reports?.data.reports.map((report) => (
        <div key={report.id}>
          <p>
            <b>{report.course}</b>
          </p>
          <p>{`${report.user.name} - ${report.courseType}`}</p>
          <p>{new Date(report.createdAt).toLocaleDateString("sk")}</p>
          <Button variant="contained" onClick={openEditReport(report.id)}>
            otvoriť
          </Button>
        </div>
      ))}
    </div>
  );
};

export default EditReports;
