import { Button, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { ChangeEvent, FormEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user-context";
import { IChangePasswordResponseError } from "../models/reset-logged-user-password";
import "./LoggedUserPasswordChange.scss";

const LoggedUserPasswordChange = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [passwordCurrent, setPasswordCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleChangePasswordCurrent = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordCurrent(event.target.value);
  };

  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleChangePasswordConfirm = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordConfirm(event.target.value);
  };

  const onResponseFail = (result: IChangePasswordResponseError) => {
    enqueueSnackbar(result.message, { variant: "error" });
    setPassword("");
    setPasswordConfirm("");
    setPasswordCurrent("");
  };

  const onReponseSuccess = () => {
    enqueueSnackbar("Heslo úspešne zmenené", { variant: "success" });
    navigate("/");
  };

  const changePassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${user?.token}`);
    myHeaders.append("Cookie", `jwt=${window.localStorage.getItem("token")}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      passwordCurrent: passwordCurrent,
      password: password,
      passwordConfirm: passwordConfirm,
    });

    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
    };

    fetch("http://localhost:4000/api/users/updateMyPassword", requestOptions)
      .then((response) => response.json())
      .then((result) =>
        result.status !== "error" ? onReponseSuccess() : onResponseFail(result)
      );
  };

  return (
    <div className="logged-user-password-change">
      <h1>Zmena hesla</h1>
      <form className="login-form" onSubmit={changePassword}>
        <TextField
          variant="outlined"
          label="Aktuálne heslo"
          type="password"
          value={passwordCurrent}
          onChange={handleChangePasswordCurrent}
          required
        />
        <TextField
          variant="outlined"
          label="Nové heslo"
          type="password"
          value={password}
          onChange={handleChangePassword}
          required
        />
        <TextField
          variant="outlined"
          label="Potvridiť nové heslo"
          type="password"
          value={passwordConfirm}
          onChange={handleChangePasswordConfirm}
          required
        />

        <Button variant="contained" type="submit">
          Zmeniť heslo
        </Button>
      </form>
    </div>
  );
};

export default LoggedUserPasswordChange;
