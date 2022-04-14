import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import ScrollToTop from 'react-scroll-up-to-top';
import ScrollToTopArrow from '../components/ScrollToTop/ScrollToTop';
import { IUserReports } from '../models/my-reports';
import './MyReports.scss';

const MyReports = () => {
  const [myReports, setMyReports] = useState<IUserReports>();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
    myHeaders.append('Cookie', `jwt=${window.localStorage.getItem('token')}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    fetch('https://nahlasovanie-neucasti-app.herokuapp.com/api/reports/all-student-reports', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 'error') {
          setMyReports(undefined);
          enqueueSnackbar(result.message, { variant: 'error' });
        } else {
          setMyReports(result);
        }
      });
    // eslint-disable-next-line
  }, []);

  return (
    <div className="my-reports">
      <ScrollToTop style={{ backgroundColor: '#43ed9c', borderRadius: '50%' }} smooth component={<ScrollToTopArrow />} />
      <h1>Moje neúčasti</h1>
      <>
        <div className="reports-section">
          <p>
            Nevyriešené - <span style={{ color: 'yellow' }}>{myReports?.data.reports.filter((report) => report.status === 'nevyriesena').length}</span>
          </p>
          {myReports?.data.reports.map(
            (report) =>
              report.status === 'nevyriesena' && (
                <div className="report">
                  <p>
                    {report.course} - {report.courseType}
                  </p>
                  <p style={{ color: 'gray' }}> {new Date(report.dayOfAbsence).toLocaleDateString('sk')}</p>
                </div>
              )
          )}
        </div>

        <div className="reports-section">
          <p>
            Akceptované - <span style={{ color: '#43ed9c' }}>{myReports?.data.reports.filter((report) => report.status === 'akceptovana').length}</span>
          </p>
          {myReports?.data.reports.map(
            (report) =>
              report.status === 'akceptovana' && (
                <div className="report">
                  <p>
                    {report.course} - {report.courseType}
                  </p>
                  <p style={{ color: 'gray' }}>{new Date(report.dayOfAbsence).toLocaleDateString('sk')}</p>
                </div>
              )
          )}
        </div>

        <div className="reports-section">
          <p>
            Neuznané - <span style={{ color: 'red' }}>{myReports?.data.reports.filter((report) => report.status === 'neuznana').length}</span>
          </p>
          {myReports?.data.reports.map(
            (report) =>
              report.status === 'neuznana' && (
                <div className="report">
                  <p>
                    {report.course} - {report.courseType}
                  </p>
                  <p style={{ color: 'gray' }}>{new Date(report.dayOfAbsence).toLocaleDateString('sk')}</p>
                </div>
              )
          )}
        </div>
      </>
    </div>
  );
};

export default MyReports;
