import React from 'react';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import styles from './styles.module.css';

function HomePage(){
  return (
    <Grid container justifyContent="center" alignItems="center" height="100vh">
      <Grid item xs={12} sm={6}>
        <Paper elevation={3} className={styles.paperStyle}>
          <Typography variant="h4" gutterBottom className={styles.headerText}>
            Welcome to HomePage
          </Typography>
          <div className={styles.cardContent}>
            <Typography variant="subtitle1" paragraph>
              Are you an existing user? Login now!
            </Typography>
            <Link to="/login" className={styles.linkStyle}>
              <Paper elevation={3} className={styles.buttonStyle}>
                <Typography variant="h6">Login</Typography>
              </Paper>
            </Link>
            <Typography variant="subtitle1" style={{ marginTop: '24px' }}>
              New User? Register now!
            </Typography>
            <Link to="/register" className={styles.linkStyle}>
              <Paper elevation={3} className={styles.buttonStyle}>
                <Typography variant="h6">Register</Typography>
              </Paper>
            </Link>
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default HomePage;
