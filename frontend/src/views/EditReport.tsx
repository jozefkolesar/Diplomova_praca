import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ISingleReport } from '../models/edit-reports';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './EditReport.scss';
import { useSnackbar } from 'notistack';

const EditReport = () => {
  const params = useParams<{ id: string }>();
  const [report, setReport] = useState<ISingleReport>();

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      `Bearer ${window.localStorage.getItem('token')}`
    );
    myHeaders.append('Cookie', `jwt=${window.localStorage.getItem('token')}`);

    var requestOptions = {
      method: 'GET',
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
      'Authorization',
      `Bearer ${window.localStorage.getItem('token')}`
    );
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Cookie', `jwt=${window.localStorage.getItem('token')}`);

    var raw = JSON.stringify({
      status: status,
    });

    var requestOptions = {
      method: 'PATCH',
      headers: myHeaders,
      body: raw,
    };

    fetch(
      `https://nahlasovanie-neucasti-app.herokuapp.com/api/reports/${params.id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 'success') {
          if (status === 'akceptovana') {
            enqueueSnackbar('Nahlásenie bolo akceptované', {
              variant: 'success',
            });
            navigate('/neucasti');
          } else {
            enqueueSnackbar('Nahlásenie nebolo uznané', { variant: 'success' });
            navigate('/neucasti');
          }
        }
      });
  };

  return (
    <div className="edit-report-container">
      <h1>Nahlásenie</h1>
      <div>
        <p>
          <b>Meno:</b> {report?.data.data.user.name}
        </p>
        <p>
          <b>Dátum nahlásenia:</b>{' '}
          {new Date(report?.data.data.createdAt!).toLocaleDateString('sk')}
        </p>
        <p>
          <b>Predmet:</b> {report?.data.data.course}
        </p>
        <p>
          <b>Dátum neúčasti:</b>{' '}
          {new Date(report?.data.data.dayOfAbsence!).toLocaleDateString('sk')}
        </p>
        <p>
          <b>Základný dôvod</b> {report?.data.data.selectDesc}
        </p>
        <p>
          <b>Dôvod neúčasti:</b> {report?.data.data.description}
        </p>
      </div>

      {report?.data.data.photo && (
        <img
          className="report-image"
          src={report?.data.data.photo}
          alt="Neúčasť"
        />
      )}

      {report && (
        <Map
          initialViewState={{
            longitude: report.data.data.long,
            latitude: report.data.data.lat,
            zoom: 14,
          }}
          style={{ margin: 20, height: 300, minWidth: 400, width: '50%' }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken="pk.eyJ1IjoiamtvbGVzYXIiLCJhIjoiY2t6MnZyOXA4MDB1ZzJwcGQ2amQyYjFwYSJ9.BYHDHQ8PEfwGVpr3VC8Brw"
        >
          <Marker
            longitude={report.data.data.long}
            latitude={report.data.data.lat}
            anchor="bottom"
          />
        </Map>
      )}

      {report?.data.data.status === 'nevyriesena' && (
        <>
          <Button
            variant="contained"
            color="success"
            onClick={updateState('akceptovana')}
          >
            Akceptovať
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={updateState('neuznana')}
          >
            Odmietnúť
          </Button>
        </>
      )}
    </div>
  );
};

export default EditReport;
