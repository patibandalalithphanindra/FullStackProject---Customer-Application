import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from '@mui/material';
import axios from 'axios';
import styles from './styles.module.css'; 
import Navbar from '../common/Navbar';

function Reward() {
  const [rewards, setRewards] = useState([]);
  const [searchCustomerId, setSearchCustomerId] = useState('');

  useEffect(() => {
    const response = localStorage.getItem('jwt');
    const headers = {
      Authorization: `Bearer ${response}`,
      'Content-Type': 'application/json',
    };

    axios
      .get('http://localhost:8080/rewards', { headers })
      .then((response) => {
        setRewards(response.data);
      })
      .catch((error) => {
        console.error('Error fetching order data:', error);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchCustomerId(e.target.value);
  };

  const filteredRewards = rewards.filter((reward) =>
    reward.customerId.includes(searchCustomerId)
  );

  return (
    <>
      <Navbar />
     <div className={styles.headerpart}> 
     <h3 className={styles.heading}><b>REWARDS INFORMATION</b></h3>
      <TextField
        label="Search Customer ID"
        variant="outlined"
        value={searchCustomerId}
        onChange={handleSearch}
      />
      </div>
     
      <TableContainer component={Paper} className={styles.container}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Reward ID</b></TableCell>
              <TableCell><b>Customer Id</b></TableCell>
              <TableCell><b>Order No</b></TableCell>
              <TableCell><b>Rewards Earned</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRewards.map((reward) => (
              <TableRow key={reward.rewardsId} className={styles.tableRow}>
                <TableCell>{reward.rewardsId}</TableCell>
                <TableCell>{reward.customerId}</TableCell>
                <TableCell>{reward.orderNo}</TableCell>
                <TableCell>{reward.rewardsEarned}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default Reward;
