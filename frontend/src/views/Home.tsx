import { Button } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user-context";
// import React, { useEffect } from "react";
import "./Home.scss";

const Home = () => {
  const { user } = useContext(UserContext);
  let navigate = useNavigate();

  const navigateTo = () => {
    user ? navigate("/neucast") : navigate("/prihlasenie");
  };

  return (
    <div className="home">
      <h1>Nahlás svoju neprítomnosť na vyučovaní </h1>
      <Button variant="contained" onClick={navigateTo}>
        TU!
      </Button>
    </div>
  );
};

export default Home;
