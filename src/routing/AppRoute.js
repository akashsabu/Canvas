import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Canvas from "../components/screens/canvas/Canvas";
import Home from "../components/screens/home/Home";

const AppRoute = () => {
 
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/canvas" element={<Canvas />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoute;
