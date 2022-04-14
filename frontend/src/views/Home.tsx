import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user-context';
import { INewReportsCount } from '../models/home';
// import React, { useEffect } from "react";
import './Home.scss';

const Home = () => {
  const { user, setUser } = useContext(UserContext);
  const [newReportsCount, setNewReportsCount] = useState(0);
  let navigate = useNavigate();

  const logOut = () => {
    setUser(null);
    window.localStorage.removeItem('token');
    navigate('/');
  };

  const navigateToLogin = () => {
    navigate('/prihlasenie');
  };

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${window.localStorage.getItem('token')}`);
    myHeaders.append('Cookie', `jwt=${window.localStorage.getItem('token')}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    fetch('https://nahlasovanie-neucasti-app.herokuapp.com/api/reports/number-of-new-reports', requestOptions)
      .then((response) => response.json())
      .then((result: INewReportsCount) => setNewReportsCount(result.results));
  }, []);

  const userRole =
    user?.role === 'admin' ? (
      <div className="links-container">
        <Link to="/neucasti">Nové nahlásenia - {newReportsCount}</Link>
        <Link to="/prehlad">Prehľad ospravedlnení</Link>
        <Link to="/sumare">Sumáre</Link>
        <Link to="/zmena-hesla">Zmeniť heslo</Link>
        <p className="log-out-button" onClick={logOut}>
          Odhlásiť
        </p>
      </div>
    ) : (
      <div className="links-container">
        <Link to="/neucast">Nahlásiť neúčasť</Link>
        <Link to="/moje-neucasti">Moje neúčasti</Link>
        <Link to="/moje-sumare">Moje sumáre</Link>
        <Link to="/zmena-hesla">Zmeniť heslo</Link>
        <p className="log-out-button" onClick={logOut}>
          Odhlásiť
        </p>
      </div>
    );

  return (
    <div className="home">
      {user ? (
        <>
          <h1 className="user-header">Vitaj {user.name}</h1>
          {userRole}
        </>
      ) : (
        <div className="default-home">
          <h1 className="user-header">Nahlás svoju neprítomnosť na vyučovaní </h1>
          <p className="home-button" onClick={navigateToLogin}>
            TU!
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
