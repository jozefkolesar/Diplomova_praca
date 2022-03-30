import React, { useEffect, useState } from "react";
import { ISummary } from "../models/summary";

const Summary = () => {
  const [summary, setSummary] = useState<ISummary | null>(null);

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

    fetch(
      "http://localhost:4000/api/reports/get-teacher-reports-statistics-by-course",
      requestOptions
    )
      .then((response) => response.json())
      .then((result: ISummary) =>
        setSummary(result.status === "error" ? null : result)
      )
      .catch((error) => console.log("error", error));
  }, []);

  return (
    <div>
      {summary === null ? (
        <div>
          <h2>Ždiane nahlásenie</h2>
        </div>
      ) : (
        <div>
          {summary?.data.reports.map((report) => (
            <div>
              {report._id.user.map((user) => (
                <>
                  <p>{user.name + " " + report.numberOfAbsences}</p>
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
                </>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Summary;
