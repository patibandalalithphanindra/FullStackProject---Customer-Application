import React from 'react';
import { Route, Routes,Navigate } from 'react-router-dom';
import { useAuth } from './service/AuthContext';
import Login from './components/Login';
import HomePage from './components/HomePage';
import Register from './components/Register';
import CustomersComponent from './components/CustomersComponent';

function App() {
  const { user } = useAuth();
  return (
    <div>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/customer"
          element={user ? <CustomersComponent /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </div>
  );
}

export default App;
