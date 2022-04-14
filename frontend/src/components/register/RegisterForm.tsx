import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/user-context';
import { IFaculties } from '../../models/faculties';
import { IContextUser } from '../../models/user';
import './RegisterForm.scss';

const RegisterForm = () => {
  const { setUser } = useContext(UserContext);

  const [faculty, setFaculty] = useState('');
  const [department, setDepartment] = useState('Hospodárska informatika');
  const [year, setYear] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [faculties, setFaculties] = useState<IFaculties>();

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleChangeFaculty = (event: SelectChangeEvent<string>) => {
    setFaculty(event.target.value);
  };

  const handleChangeDepartment = (event: SelectChangeEvent<string>) => {
    setDepartment(event.target.value);
  };

  const handleChangeYear = (event: SelectChangeEvent<number>) => {
    setYear(event.target.value as number);
  };

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleChangeConfirmPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirm(event.target.value);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      name: name,
      email: email,
      faculty: faculty,
      department: department,
      year: year,
      password: password,
      passwordConfirm: 'heslo1234',
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };

    fetch('https://nahlasovanie-neucasti-app.herokuapp.com/api/users/signup', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 'error') {
          enqueueSnackbar(result.message, { variant: 'error' });
        } else {
          window.localStorage.setItem('token', result.token);
          setUser({ ...result.data.user, token: result.token } as IContextUser);
          navigate('/');
        }
      });
  };

  useEffect(() => {
    var requestOptions = {
      method: 'GET',
    };

    fetch('https://nahlasovanie-neucasti-app.herokuapp.com/api/users/get-faculties', requestOptions)
      .then((response) => response.json())
      .then((result: IFaculties) => setFaculties(result));
  }, []);

  return (
    <form className="register-form" onSubmit={submit}>
      <TextField variant="outlined" label="Meno a priezvisko" onChange={handleChangeName} value={name} />
      <TextField variant="outlined" label="Email" type="email" onChange={handleChangeEmail} value={email} />
      <TextField variant="outlined" label="Heslo" type="password" onChange={handleChangePassword} value={password} />
      <TextField variant="outlined" label="Opakuj heslo" type="password" onChange={handleChangeConfirmPassword} value={passwordConfirm} />
      <FormControl fullWidth>
        <InputLabel>Fakulta</InputLabel>
        <Select value={faculty} label="Fakulta" onChange={handleChangeFaculty}>
          {faculties?.data.data.map((faculty) => (
            <MenuItem key={faculty._id} value={faculty.name}>
              {faculty.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Odbor</InputLabel>
        <Select value={department} label="Odbor" onChange={handleChangeDepartment}>
          {faculties?.data.data
            .find((curFaculty) => curFaculty.name === faculty)
            ?.department.map((department, index) => (
              <MenuItem key={index} value={department}>
                {department}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Ročník</InputLabel>
        <Select value={year} label="Ročník" onChange={handleChangeYear}>
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={5}>5</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" type="submit">
        Registrovať
      </Button>
    </form>
  );
};

export default RegisterForm;
