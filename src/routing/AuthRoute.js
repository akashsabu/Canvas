import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../components/screens/authentication/Login";

const AuthRoute = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default AuthRoute;
