import { Button, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ResetPassword.scss';

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleChangePasswordConfirm = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      `Bearer ${window.localStorage.getItem('token')}`
    );
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Cookie', `jwt=${window.localStorage.getItem('token')}`);

    var raw = JSON.stringify({
      password: password,
      passwordConfirm: confirmPassword,
    });

    var requestOptions = {
      method: 'PATCH',
      headers: myHeaders,
      body: raw,
    };

    fetch(
      `https://nahlasovanie-neucasti-app.herokuapp.com/api/users/resetPassword/${token}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 'error') {
          enqueueSnackbar(result.message, { variant: 'error' });
        } else {
          navigate('/prihlasenie');
          enqueueSnackbar('Heslo úspešne zmenené', { variant: 'success' });
        }
      });
  };

  return (
    <div className="email-password-reset">
      <h1>Zmena hesla</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          label="Heslo"
          type="password"
          value={password}
          onChange={handleChangePassword}
          required
        />
        <TextField
          variant="outlined"
          label="Potvrdiť heslo"
          type="password"
          value={confirmPassword}
          onChange={handleChangePasswordConfirm}
          required
        />
        <Button variant="contained" type="submit">
          Odoslať
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
