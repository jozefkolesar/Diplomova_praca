import { Button, TextField } from "@mui/material";
import React, { ChangeEvent, FormEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/user-context";
import { IUser } from "../../models/user";
import "./LoginForm.scss";

const LoginForm = () => {
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      });
  };

  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <div>
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
      </form>
    </div>
  );
};

export default LoginForm;
