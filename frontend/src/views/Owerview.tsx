import React, { useEffect, useState } from 'react';
import CalendarPicker from '@mui/lab/CalendarPicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import isWeekend from 'date-fns/isWeekend';
import { IOverviewReports } from '../models/overview';
import './Owerview.scss';
import ScrollToTop from 'react-scroll-up-to-top';
import ScrollToTopArrow from '../components/ScrollToTop/ScrollToTop';

const Overview = () => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [reports, setReports] = useState<IOverviewReports | null>(null);

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${window.localStorage.getItem('token')}`);
    myHeaders.append('Cookie', `jwt=${window.localStorage.getItem('token')}`);

    var raw = JSON.stringify({
      date: date,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };

    fetch('https://nahlasovanie-neucasti-app.herokuapp.com/api/reports/get-reports-by-date', requestOptions)
      .then((response) => response.json())
      .then((result: IOverviewReports) => setReports(result.status === 'error' ? null : result));
  }, [date]);

  return (
    <div className="overview">
      <ScrollToTop style={{ backgroundColor: '#43ed9c', borderRadius: '50%' }} smooth component={<ScrollToTopArrow />} /> <h1>Prehľad ospravedlnení</h1>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CalendarPicker date={date} onChange={(newDate) => setDate(newDate)} shouldDisableDate={isWeekend} />
      </LocalizationProvider>
      {reports === null ? (
        <h2>Žiadné nahlásenie</h2>
      ) : (
        <div>
          {reports.data.reports.map((report) => (
            <div className="overview-item" key={report._id}>
              {report.pushed_reports.map((insideReport) => (
                <div key={insideReport.__v} className="report-item">
                  <div>
                    <p>
                      <b>{insideReport.course}</b>
                    </p>
                    {insideReport.user.map((insideUser) => (
                      <p key={insideUser.__v}>
                        {insideUser.name} - <span style={{ color: 'gray' }}>{insideReport.courseType}</span>
                      </p>
                    ))}
                  </div>
                  <p>{insideReport.status}</p>
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
