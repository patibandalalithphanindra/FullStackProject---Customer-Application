import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Paper, Typography } from '@mui/material';

const Rewards = ({ id }) => {
  const [rewardsData, setRewardsData] = useState({
    rewardsEarned: 0.0,
    rewardsRedeemed: 0.0,
    rewardsBalance: 0.0,
  });

  useEffect(() => {
    const response = localStorage.getItem('jwt');
    const headers = {
      Authorization: `Bearer ${response}`,
      'Content-Type': 'application/json',
    };
    const apiUrl = `http://localhost:8080/rewards/rewardDetails/${id}`;

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        const { data } = response;
        setRewardsData({
          rewardsEarned: data[0],
          rewardsRedeemed: data[1],
          rewardsBalance: data[2],
        });
      })
      .catch((error) => {
        console.error('Error fetching reward details:', error);
      });
  }, [id]);

  return (
    <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
      <Typography variant="h6">Rewards Balance</Typography>
      <Typography variant="body1">Rewards Earned: {rewardsData.rewardsEarned}</Typography>
      <Typography variant="body1">Rewards Redeemed: {rewardsData.rewardsRedeemed}</Typography>
      <Typography variant="body1">Rewards Balance: {rewardsData.rewardsBalance}</Typography>
    </Paper>
  );
};

export default Rewards;
