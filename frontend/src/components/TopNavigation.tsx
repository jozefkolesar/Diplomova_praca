import React, { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { UserContext } from "../context/user-context";
import "./TopNavigation.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const TopNavigation = () => {
  const { user } = useContext(UserContext);

  const location = useLocation();

  const showLoginRegister = !user && (
    <>
      <NavLink to="/registracia">Registrácia</NavLink>
      <NavLink to="/prihlasenie" className="login-button">
        Prihlásenie
      </NavLink>
    </>
  );

  return (
    <div className="top-navigation">
      {(location.pathname !== "/" || (user && location.pathname !== "/")) && (
        <NavLink
          to={location.pathname.includes("/schvalenie") ? "/neucasti" : "/"}
        >
          <ArrowBackIcon htmlColor="#43ed9c" fontSize="large" />
        </NavLink>
      )}
      {showLoginRegister}
    </div>
  );
};

export default TopNavigation;
