import React, { useEffect, useState } from "react";
import CalendarPicker from "@mui/lab/CalendarPicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import isWeekend from "date-fns/isWeekend";
import { IOverviewReports } from "../models/overview";

const Overview = () => {
  const [date, setDate] = useState<Date | null>(new Date());

  const [reports, setReports] = useState<IOverviewReports | null>(null);

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Authorization",
      `Bearer ${window.localStorage.getItem("token")}`
    );

    var raw = JSON.stringify({
      date: date,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    fetch(
      "http://localhost:4000/api/reports/get-reports-by-date",
      requestOptions
    )
      .then((response) => response.json())
      .then((result: IOverviewReports) =>
        setReports(result.status === "error" ? null : result)
      );
  }, [date]);

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CalendarPicker
          date={date}
          onChange={(newDate) => setDate(newDate)}
          shouldDisableDate={isWeekend}
        />
      </LocalizationProvider>

      {reports === null ? (
        <h2>Žiadné nahlásenie</h2>
      ) : (
        <div>
          {reports.data.reports.map((report) => (
            <div>
              {report.pushed_reports.map((insideReport) => (
                <div>
                  <p>
                    <b>{insideReport.course}</b>
                  </p>
                  <p>{insideReport.status}</p>
                  {insideReport.user.map((insideUser) => (
                    <p>{insideUser.name + " " + insideReport.courseType}</p>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Overview;
