import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IEditReports } from '../models/edit-reports';
import './EditReports.scss';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const EditReports = () => {
  const [reports, setReports] = useState<IEditReports | undefined>();

  const navigate = useNavigate();

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${window.localStorage.getItem('token')}`);
    myHeaders.append('Cookie', `jwt=${window.localStorage.getItem('token')}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    fetch('https://nahlasovanie-neucasti-app.herokuapp.com/api/reports/pending-reports', requestOptions)
      .then((response) => response.json())
      .then((result: IEditReports) => setReports(result.status === 'error' ? undefined : result));
  }, []);

  const openEditReport = (id: string) => () => {
    navigate(`/schvalenie/${id}`);
  };

  const isArrayEmpty =
    reports === undefined ? (
      <h1>Žiadné nové neúčasti</h1>
    ) : (
      reports.data.reports.map((report) => (
        <div key={report.id} className="report-node">
          <div>
            <p>
              <b>{report.course}</b>
            </p>
            <p>
              {report.user.name} - <span className="course-type">{report.courseType === 'cvicenie' ? 'Cvičenie' : 'Prednáška'}</span>
            </p>
          </div>
          <p>{new Date(report.createdAt).toLocaleDateString('sk')}</p>
          <Button variant="contained" onClick={openEditReport(report.id)}>
            <ArrowForwardIcon />
          </Button>
        </div>
      ))
    );

  return (
    <div className="edit-reports-container">
      <h1>Nové nahlásenia</h1>
      {isArrayEmpty}
    </div>
  );
};

export default EditReports;
