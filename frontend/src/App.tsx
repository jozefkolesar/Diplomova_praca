import React, { useEffect, useState } from 'react';
import './App.scss';
import { BrowserRouter } from 'react-router-dom';
import Layout from './views/Layout';
import TopNavigation from './components/TopNavigation';
import { UserContext } from './context/user-context';
import { IContextUser, IRefreshUser } from './models/user';

function App() {
  const [user, setUser] = useState<IContextUser | null>(null);
  const [isFetchingUser, setIsFetchingUser] = useState(true);

  const contextValues = {
    user,
    setUser,
    isFetchingUser,
    setIsFetchingUser,
  };

  useEffect(() => {
    const token: string | null = window.localStorage.getItem('token');
    if (token) {
      var myHeaders = new Headers();
      myHeaders.append('Authorization', `Bearer ${token}`);
      myHeaders.append('Cookie', `jwt=${window.localStorage.getItem('token')}`);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
      };

      fetch('https://nahlasovanie-neucasti-app.herokuapp.com/api/users/me', requestOptions)
        .then((response) => response.json())
        .then((result: IRefreshUser) => {
          setUser({ ...result.data.data, token: token });
          // console.log(result);
        });
    } else {
      setUser(null);
    }
  }, []);

  return (
    <div>
      <UserContext.Provider value={contextValues}>
        <BrowserRouter>
          <TopNavigation />
          <Layout />
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
