import React from "react";
import { Route, Routes } from "react-router-dom";
import AboutProject from "./AboutProject";
import EditReport from "./EditReport";
import EditReports from "./EditReports";
import Home from "./Home";
import Login from "./Login";
import MyReports from "./MyReports";
import Overview from "./Owerview";
import Register from "./Register";
import Report from "./Report";
import Summary from "./Summary";

const Layout = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/o-projekte" element={<AboutProject />} />
      <Route path="/registracia" element={<Register />} />
      <Route path="/prihlasenie" element={<Login />} />
      <Route path="/neucast" element={<Report />} />
      <Route path="/moje-neucasti" element={<MyReports />} />
      <Route path="/neucasti" element={<EditReports />} />
      <Route path="/schvalenie/:id" element={<EditReport />} />
      <Route path="/prehlad" element={<Overview />} />
      <Route path="/sumare" element={<Summary />} />
    </Routes>
  );
};
export default Layout;
