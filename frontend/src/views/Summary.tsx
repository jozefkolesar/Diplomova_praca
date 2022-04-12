import { TextField } from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
import { ISummary, Report } from "../models/summary";
import "./Summary.scss";
import ScrollToTop from "react-scroll-up-to-top";
import ScrollToTopArrow from "../components/ScrollToTop/ScrollToTop";

const Summary = () => {
  const [summary, setSummary] = useState<ISummary | null>(null);
  const [reports, setReports] = useState<Report[] | null>();

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
      "http://localhost:4000/api/reports/get-teacher-reports-statistics-by-course",
      requestOptions
    )
      .then((response) => response.json())
      .then((result: ISummary) => {
        console.log(result);
        setSummary(result.status === "error" ? null : result);
        setReports(result.status === "error" ? null : result.data.reports);
      })
      .catch((error) => console.log("error", error));
  }, []);

  const getColor = (report: Report) => {
    if (report.akceptovanych > 3 || report.zamietnutych > 1) return "red";
    if (report.akceptovanych === 3 || report.zamietnutych === 0)
      return "yellow";
    if (report.akceptovanych < 3 || report.zamietnutych === 0) return "green";
  };

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setReports(
      summary?.data.reports.filter((report) =>
        report._id.user.find(
          (user) =>
            user.name
              .toLocaleLowerCase()
              .includes(event.target.value.toLocaleLowerCase()) ||
            report._id.course
              .toLocaleLowerCase()
              .includes(event.target.value.toLocaleLowerCase())
        )
      )
    );
  };

  return (
    <div className="summary">
      <ScrollToTop
        style={{ backgroundColor: "#43ed9c", borderRadius: "50%" }}
        smooth
        component={<ScrollToTopArrow />}
      />{" "}
      <h1>Sumáre</h1>
      {!reports ? (
        <div>
          <h2>Žiadne nahlásenie</h2>
        </div>
      ) : (
        <div className="summary-column">
          <TextField
            variant="outlined"
            label="Filter"
            onChange={handleChangeSearch}
          />
          {reports.map((report, index) => (
            <div key={index}>
              {report._id.user.map((user, index) => (
                <div key={index}>
                  <p>
                    {report._id.course} -{" "}
                    <span style={{ color: "gray" }}>
                      {report._id.courseType}
                    </span>
                  </p>
                  <div className="summary-row">
                    <p style={{ color: getColor(report) }}>{user.name}</p>
                    <div className="count-row">
                      <div
                        style={{
                          backgroundColor: "green",
                          color: "white",
                          padding: 10,
                        }}
                      >
                        akceptované: {report.akceptovanych}
                      </div>
                      <div
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          padding: 10,
                        }}
                      >
                        odmietnuté: {report.zamietnutych}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Summary;
