import React from "react";
import { Route, Routes } from "react-router-dom";
import AboutProject from "./AboutProject";
import Home from "./Home";
import Login from "./Login";
import MyReports from "./MyReports";
import Register from "./Register";
import Report from "./Report";

const Layout = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/o-projekte" element={<AboutProject />} />
      <Route path="/registracia" element={<Register />} />
      <Route path="/prihlasenie" element={<Login />} />
      <Route path="/neucast" element={<Report />} />
      <Route path="/moje-neucasti" element={<MyReports />} />
    </Routes>
  );
};
export default Layout;
