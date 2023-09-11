import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import Register from "./components/Register";
import LandingPage from "./components/LandingPage";
import { Box } from "@mui/material";
import Customer from "./components/Customer";
import Order from "./components/Order";
import Reward from "./components/Reward";

function App() {
  const response = localStorage.getItem("jwt");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (response && (location.pathname === "/login" ||location.pathname === "/register")) {
      navigate("/homepage");
    }
    else if (response && (location.pathname === "/customers" )) {
      navigate("/customers");
    }
    else if( !response && (location.pathname === "/login")){
      navigate("/login")
    }
    else if( !response && (location.pathname === "/register")){
      navigate("/register")
    } else if(!response&& (location.pathname === "/")) {
      navigate("/");
    }
  }, [response, location.pathname, navigate]);

  return (
    <Box>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={<Login/>}
        />
        <Route path="/register" element={ <Register /> } />
        <Route
          path="/homepage"
          element={
            response ? (
              <LandingPage />
            ) : (
              <Login/>
            )
          }
        />
        <Route
          path="/customers"
          element={
            response ? (
              <Customer />
            ) : (
              <Login/>
            )
          }
        />
         <Route
          path="/orders"
          element={
            response ? (
              <Order />
            ) : (
              <Login/>
            )
          }
        />
        <Route
          path="/rewards"
          element={
            response ? (
              <Reward />
            ) : (
              <Login/>
            )
          }
        />
      </Routes>
    </Box>
  );
}

export default App;