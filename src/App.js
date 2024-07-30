import "./App.css";
import React, { useState } from "react";

import Canvas from "./components/screens/canvas/Canvas";
import Toolbar from "./components/screens/canvas/Toolbar";
import AuthRoute from "./routing/AuthRoute";
import AppRoute from "./routing/AppRoute";


function App() {

  return (
    <div className="App">
            <AppRouter />
    </div>
  );
}


function AppRouter() {
    // const log_status = useSelector((state) => state.user.value.is_logged_in);
    const log_status = true;

  return (
    <>
      {log_status ? <AppRoute /> : <AuthRoute />}
    </>
  );
} 
export default App;
