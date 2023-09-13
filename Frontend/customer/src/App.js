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
import EditCustomer from "./components/Customer/EditCustomer";
import AddCustomer from "./components/Customer/AddCustomer";
import ViewOrder from "./components/Order/ViewOrder";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/Customer/Dashboard';

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
    else if (response && (location.pathname === "/customers" )) {
      navigate("/customers");
    }
    else if (response && (location.pathname === "/dashboard/:customerId" )) {
      navigate("/dashboard/:customerId");
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
          path="/customers/:customerId/edit"
          element={
            response ? (
              <EditCustomer/>
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/dashboard/:customerId"
          element={
            response ? (
              <Dashboard />
            ) : (
              <Login/>
            )
          }
        />
         <Route
          path="/customer/add"
          element={
            response ? (
              <AddCustomer/>
            ) : (
              <Login />
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
          path="/orders/:orderNo"
          element={
            response ? (
              <ViewOrder />
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
      <ToastContainer /> 
    </Box>
  );
}

export default App;