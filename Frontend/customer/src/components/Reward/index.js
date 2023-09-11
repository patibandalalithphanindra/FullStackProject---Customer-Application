import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from '@mui/material';
import axios from 'axios';
import styles from './styles.module.css'; 
import Navbar from '../common/Navbar';

function Reward() {
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    const response = localStorage.getItem('jwt');
    const headers = {
      Authorization: `Bearer ${response}`,
      'Content-Type': 'application/json',
    };
  
    axios
      .get('http://localhost:8080/rewards', { headers })
      .then((response) => {
        console.log("Rewards :", response.data);
        setRewards(response.data);
      })
      .catch((error) => {
        console.error('Error fetching order data:', error);
      });
  }, []);


  const handleView = (rewardsId) => {
    
  };

  return (
    <>
    <Navbar/>
    <h3 className={styles.heading}><b>REWARDS INFORMATION</b></h3>
    <TableContainer component={Paper} className={styles.container}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><b>Reward ID</b></TableCell>
            <TableCell><b>Customer Id</b></TableCell>
            <TableCell><b>Order No</b></TableCell>
            <TableCell><b>Total Order Amount</b></TableCell>
            <TableCell><b>Rewards Earned</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rewards.map((reward) => (
            <TableRow key={reward.rewardsId} className={styles.tableRow}>
              <TableCell>{reward.customerId}</TableCell>
              <TableCell>{reward.orderNo}</TableCell>
              <TableCell>{reward.rewardsEarned}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  className={`${styles.button} ${styles.primaryButton}`}
                  onClick={() => handleView(reward.rewardsId)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
};

export default Reward;
