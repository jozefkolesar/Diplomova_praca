import { Button, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IPasswordReset } from '../models/password-reset';
import './PasswordReset.scss';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const onSuccess = () => {
    enqueueSnackbar('Token odoslaný na mail! (prosím skontrolujte zložku SPAM)', { variant: 'success' });
    navigate('/');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${window.localStorage.getItem('token')}`);
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Cookie', `jwt=${window.localStorage.getItem('token')}`);

    var raw = JSON.stringify({
      email: email,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };

    fetch('https://nahlasovanie-neucasti-app.herokuapp.com/api/users/forgotPassword', requestOptions)
      .then((response) => response.json())
      .then((result: IPasswordReset) => (result.status === 'error' ? enqueueSnackbar(result.message, { variant: 'error' }) : onSuccess()));
  };

  return (
    <div className="password-reset">
      <h1>Zabudnuté heslo</h1>
      <form onSubmit={handleSubmit}>
        <TextField variant="outlined" label="E-mail" type="email" value={email} onChange={handleChangeEmail} required />
        <Button variant="contained" type="submit">
          Odoslať
        </Button>
      </form>
    </div>
  );
};

export default PasswordReset;
