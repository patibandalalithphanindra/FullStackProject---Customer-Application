import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import Register from "./components/Register";
import LandingPage from "./components/LandingPage";
import { Box } from "@mui/material";
 function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Box >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/homepage"
          element={
            isAuthenticated ? (
              <LandingPage />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }></Route>
      </Routes>
    </Box>
  );
}

export default App;
