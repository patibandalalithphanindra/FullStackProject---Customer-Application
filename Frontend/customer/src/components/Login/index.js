import React, { useState } from 'react';
import { Button, Container, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

function Login() {
  const [formData, setFormData] = useState({
    name: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/user/authenticate', formData);
      if (response.status === 200) {
        localStorage.setItem("jwt",response?.data?.token);
        localStorage.setItem("name",response?.data?.name);
        navigate('/homepage');
      } 
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <Container className={styles.container} maxWidth="xs">
      <Typography variant="h4">Login</Typography>
      <form className={styles.form} onSubmit={handleLogin}>
        <TextField
          label="Username"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
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
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
    </Container>
  );
}

export default Login;
