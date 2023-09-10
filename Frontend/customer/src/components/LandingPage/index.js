import React from 'react';
import { Button, Card, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

function LandingPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className={styles.container}>
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
      <div className={styles.cardContainer}>
        <Link to="/customer" className={styles.cardLink}>
          <Card className={styles.card}>
            <div className={styles.cardContent}>
              <Typography variant="h5">Customer</Typography>
              <Typography variant="body2">
                Click here to view Customer information.
              </Typography>
            </div>
          </Card>
        </Link>
        <Link to="/order" className={styles.cardLink}>
          <Card className={styles.card}>
            <div className={styles.cardContent}>
              <Typography variant="h5">Order</Typography>
              <Typography variant="body2">
                Click here to view Order details.
              </Typography>
            </div>
          </Card>
        </Link>
        <Link to="/rewards" className={styles.cardLink}>
          <Card className={styles.card}>
            <div className={styles.cardContent}>
              <Typography variant="h5">Rewards</Typography>
              <Typography variant="body2">
                Click here to check Rewards status.
              </Typography>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
