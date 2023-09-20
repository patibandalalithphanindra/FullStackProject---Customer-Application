import React, { useState, useEffect } from 'react';
import axios from "axios";
import {  Grid, Paper, Box, Divider } from '@mui/material';
import { People, ShoppingCart, Star} from '@mui/icons-material';

import { Card, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import Navbar from '../common/Navbar';



function LandingPage() {
  const [counts, setCounts] = useState([]);
  const fetchCustomerData = () => {
    const response = localStorage.getItem('jwt');
    const headers = {
      Authorization: `Bearer ${response}`,
      'Content-Type': 'application/json',
    };

    axios
      .get('http://localhost:8080/customers/counts', { headers })
      .then((response) => {
        setCounts(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Error fetching customer counts data:', error);
      });
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  return (
    <div className={styles.container} style={{ }}>
      <Navbar/ >
      <Paper elevation={3} sx={{ p: 2,width: "300", marginTop:"20px",marginLeft:"200px", marginRight:"200px" }}  >
      <Grid align="center" container spacing={6} >
        <Grid item xs={4}>
          <Box display="flex" alignItems="center">
          <People sx={{fontSize:60}} />
            &nbsp; &nbsp;
            <div>
              <Typography variant="h6">Customers Onboarded</Typography>
              <Typography variant="subtitle1">{counts[0]} </Typography>
            </div>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box display="flex" alignItems="center">
          <ShoppingCart color='primary' sx={{ fontSize: 60 }} />
            &nbsp;
            <div>
              <Typography variant="h6">Total Orders Placed</Typography>
              <Typography variant="subtitle1">{counts[1]} </Typography>
            </div>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box display="flex" alignItems="center">
          <Star color='gold'   sx={{ fontSize: 60 }} />
            &nbsp; 
            <div>
              <Typography variant="h6">No of Rewards Earned</Typography>
              <Typography variant="subtitle1">{counts[2]} </Typography>
            </div>
          </Box>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" color="textPrimary">
        <b>Welcome! Click on respective card to know more detailed info. </b>
      </Typography>
    </Paper>
      <div className={styles.cardContainer}>
        <Link to="/customers/" className={styles.cardLink}>
          <Card className={styles.card}>
            <div className={styles.cardContent}>
              <Typography variant="h5">Customer</Typography>
              <Typography variant="body2">
                Click here to view Customer information.
              </Typography>
            </div>
          </Card>
        </Link>
        <Link to="/orders/" className={styles.cardLink}>
          <Card className={styles.card}>
            <div className={styles.cardContent}>
              <Typography variant="h5">Order</Typography>
              <Typography variant="body2">
                Click here to view Order details.
              </Typography>
            </div>
          </Card>
        </Link>
        <Link to="/rewards/" className={styles.cardLink}>
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