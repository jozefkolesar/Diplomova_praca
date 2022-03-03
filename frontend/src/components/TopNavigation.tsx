import { Button } from "@mui/material";
import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context/user-context";
import "./TopNavigation.scss";

const TopNavigation = () => {
  const { user, setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const logOut = () => {
    setUser(null);
    window.localStorage.removeItem("token");
    navigate("/");
  };

  const showLogOutButton = user ? (
    <div>
      <p>{user.email}</p>
      <Button variant="contained" onClick={logOut}>
        Odhásiť
      </Button>
    </div>
  ) : (
    <>
      <NavLink to="/registracia">Registrácia</NavLink>
      <NavLink to="/prihlasenie">Prihlásenie</NavLink>
    </>
  );

  const showReports = user ? (
    <>
      <NavLink to="/neucast">Neúčasť</NavLink>
      <NavLink to="/moje-neucasti">Moje neúčasti</NavLink>
    </>
  ) : (
    <NavLink to="/o-projekte">O projekte</NavLink>
  );

  return (
    <div className="top-navigation">
      <NavLink to="/">Domov</NavLink>
      {showReports}
      {showLogOutButton}
    </div>
  );
};

export default TopNavigation;
