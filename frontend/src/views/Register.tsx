import React from "react";
import RegisterForm from "../components/register/RegisterForm";
import "./Register.scss";

const Register = () => {
  return (
    <div className="register">
      <h1>Registrácia</h1>
      <RegisterForm />
    </div>
  );
};

export default Register;
