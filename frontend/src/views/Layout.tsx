import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { UserContext } from "../context/user-context";
import EditReport from "./EditReport";
import EditReports from "./EditReports";
import Home from "./Home";
import LoggedUserPasswordChange from "./LoggedUserPasswordChange";
import Login from "./Login";
import MyReports from "./MyReports";
import NotFound from "./NotFound";
import Overview from "./Owerview";
import PasswordReset from "./PasswordReset";
import Register from "./Register";
import Report from "./Report";
import ResetPassword from "./ResetPassword";
import StudentSummary from "./StudentSummary";
import Summary from "./Summary";

const Layout = () => {
  const { user } = useContext(UserContext);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/registracia" element={<Register />} />
      <Route path="/prihlasenie" element={<Login />} />

      {user?.role === "admin" && (
        <>
          <Route path="/neucasti" element={<EditReports />} />
          <Route path="/schvalenie/:id" element={<EditReport />} />
          <Route path="/prehlad" element={<Overview />} />
          <Route path="/sumare" element={<Summary />} />
          <Route path="/zmena-hesla" element={<LoggedUserPasswordChange />} />
        </>
      )}

      {user?.role === "student" && (
        <>
          <Route path="/neucast" element={<Report />} />
          <Route path="/moje-neucasti" element={<MyReports />} />
          <Route path="/moje-sumare" element={<StudentSummary />} />
          <Route path="/zmena-hesla" element={<LoggedUserPasswordChange />} />
        </>
      )}
      <Route path="/reset-hesla" element={<PasswordReset />} />
      <Route
        path="/api/users/resetPassword/:token"
        element={<ResetPassword />}
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
export default Layout;
