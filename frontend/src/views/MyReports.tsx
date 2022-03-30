import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { IUserReports } from "../models/my-reports";
import Paper from "@mui/material/Paper";

const MyReports = () => {
  const [myReports, setMyReports] = useState<IUserReports>();

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    fetch(
      "http://localhost:4000/api/reports/all-student-reports",
      requestOptions
    )
      .then((response) => response.json())
      .then((result: IUserReports) =>
        setMyReports(result.status === "error" ? undefined : result)
      );
  }, []);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Dátum vytvorenia</TableCell>
              <TableCell align="right">Dátum absencie</TableCell>
              <TableCell align="right">Kurz</TableCell>
              <TableCell align="right">Typ kurzu</TableCell>
              <TableCell align="right">Popis</TableCell>
              <TableCell align="right">Učiteľ</TableCell>
              <TableCell align="right">Pozícia</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {myReports?.data.reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell align="right">{report.status}</TableCell>
                <TableCell align="right">{report.createdAt}</TableCell>
                <TableCell align="right">{report.dayOfAbsence}</TableCell>
                <TableCell align="right">{report.course}</TableCell>
                <TableCell align="right">{report.courseType}</TableCell>
                <TableCell align="right">{report.description}</TableCell>
                <TableCell align="right">{report.reciever}</TableCell>
                <TableCell align="right">
                  {report.long + " " + report.lat}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MyReports;
