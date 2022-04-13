import { TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { ChangeEvent, useEffect, useState } from "react";
import ScrollToTop from "react-scroll-up-to-top";
import ScrollToTopArrow from "../components/ScrollToTop/ScrollToTop";
import { IStudentSummary, Report } from "../models/student-summary";
import "./StudentSummary.scss";

const StudentSummary = () => {
  const [summary, setSummary] = useState<IStudentSummary | null>(null);
  const [reports, setReports] = useState<Report[] | null>();
  const { enqueueSnackbar } = useSnackbar();

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
      "http://localhost:4000/api/reports/get-student-reports-by-course",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "error") {
          setSummary(null);
          setReports(null);
          enqueueSnackbar(result.message, { variant: "error" });
        } else {
          setSummary(result);
          setReports(result.data.reports);
        }
      })
      .catch((error) => console.log("error", error));
    // eslint-disable-next-line
  }, []);

  const getColor = (report: Report) => {
    if (report.Akceptovaných > 3 || report.Zamietnutých > 1) return "red";
    if (report.Akceptovaných === 3 || report.Zamietnutých === 0)
      return "yellow";
    if (report.Akceptovaných < 3 || report.Zamietnutých === 0) return "green";
  };

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setReports(
      summary?.data.reports.filter((report) =>
        report._id.course
          .toLocaleLowerCase()
          .includes(event.target.value.toLocaleLowerCase())
      )
    );
  };

  return (
    <div className="student-summary">
      <ScrollToTop
        style={{ backgroundColor: "#43ed9c", borderRadius: "50%" }}
        smooth
        component={<ScrollToTopArrow />}
      />{" "}
      <h1>Moje sumáre</h1>
      {!reports ? (
        <div>
          <h2>Žiadne nahlásenie</h2>
        </div>
      ) : (
        <div>
          <TextField
            fullWidth
            variant="outlined"
            label="Filter"
            onChange={handleChangeSearch}
          />
          {reports.map((report, index) => (
            <div key={index}>
              <div key={index} className="report-container">
                <div>
                  <p style={{ color: getColor(report) }}>
                    {report._id.course}{" "}
                  </p>
                  <p style={{ color: "gray" }}>{report._id.courseType}</p>
                </div>
                <div className="count-container">
                  <div
                    style={{
                      backgroundColor: "green",
                      color: "white",
                      padding: 8,
                      fontSize: 12,
                    }}
                  >
                    akceptované: {report.Akceptovaných}
                  </div>
                  <div
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      padding: 8,
                      fontSize: 12,
                    }}
                  >
                    odmietnuté: {report.Zamietnutých}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentSummary;
