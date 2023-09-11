import { Typography,Button } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

function Navbar() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
      };
  return (
    <div className={styles.header}>
    <Typography variant="h6" style={{ color: '#fff' }}>
      Customer Management System
    </Typography>
    <Button
      variant="contained"
      color="secondary"
      onClick={handleLogout}
    >
      Logout
    </Button>
  </div>
  )
}

export default Navbar;
