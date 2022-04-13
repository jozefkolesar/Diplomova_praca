import { Button, TextField } from "@mui/material";
import React, { ChangeEvent, FormEvent, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/user-context";
import { IUser } from "../../models/user";
import "./LoginForm.scss";
import { useSnackbar } from "notistack";

const LoginForm = () => {
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      email: email,
      password: password,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    fetch("http://localhost:4000/api/users/login", requestOptions)
      .then((response) => response.json())
      .then((result: IUser) => {
        window.localStorage.setItem("token", result.token);
        setUser({ ...result.data.user, token: result.token });
      })
      .then(() => {
        navigate("/");
      })
      .catch(() =>
        enqueueSnackbar("Nesprávne prihlasovacie údaje", { variant: "error" })
      );
  };

  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <div className="login-form-container">
      <h1>Prihlásenie</h1>
      <form className="login-form" onSubmit={submit}>
        <TextField
          variant="outlined"
          label="Email"
          type="email"
          value={email}
          onChange={handleChangeEmail}
          required
        />
        <TextField
          variant="outlined"
          label="Heslo"
          type="password"
          value={password}
          onChange={handleChangePassword}
          required
        />

        <Button variant="contained" type="submit">
          Prihlásiť sa
        </Button>
        <p>
          <Link to="/reset-hesla">Zabudli ste svoje heslo?</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
