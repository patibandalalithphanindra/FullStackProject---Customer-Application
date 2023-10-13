import React, { useState } from "react";
import { Button, Container, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register({ toggleForm }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roles: "ROLE_ADMIN",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isEmailValid(formData.email)) {
      toast.error("Invalid email address. Please enter a valid email.", {
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 900,
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/user/add",
        formData
      );
      if (response.status === 200) {
        localStorage.setItem("jwt", response?.data?.token);
        localStorage.setItem("name", response?.data?.name);
        navigate("/homepage");
        toast.success("Registered Successfully!", {
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: 900,
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.", {
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 900,
      });
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4">Register</Typography>
      <form onSubmit={handleRegister}>
        <TextField
          label="Username"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          data-testid="username"
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          data-testid="email"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          data-testid="password"
        />
        <Button
          type="submit"
          variant="contained"
          color="success"
          data-testid="register"
          fullWidth
          className={styles.registerButton}>
          Register
        </Button>
      </form>
      <div className={styles.switchLink}>
        <Typography variant="body2">
          Already have an account?{" "}
          <span className={styles.switchButton} onClick={toggleForm}>
            Switch to Login
          </span>
        </Typography>
      </div>
    </Container>
  );
}

export default Register;
