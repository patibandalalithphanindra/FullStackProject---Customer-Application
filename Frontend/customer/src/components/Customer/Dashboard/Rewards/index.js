import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Grid, Paper, Box, Divider } from "@mui/material";

const RedeemedCoinsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="50"
    height="50"
    data-testid="redeemed"
  >
    <path d="M18 5h-11h3a4 4 0 0 1 0 8h-3l6 6" />
    <line x1="7" y1="9" x2="18" y2="9" />
  </svg>
);

const EarnedCoinsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    width="50"
    height="50"
    data-testid="earned"
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm7-6a1 1 0 0 0 0 2h3c.34 0 .872.11 1.29.412.19.136.372.321.505.588H7.997a1 1 0 1 0 0 2h4.798a1.58 1.58 0 0 1-.504.588A2.352 2.352 0 0 1 11 12H7.997a1 1 0 0 0-.625 1.781l5.003 4a1 1 0 1 0 1.25-1.562L10.848 14h.15c.661 0 1.629-.19 2.46-.789A3.621 3.621 0 0 0 14.896 11H16a1 1 0 1 0 0-2h-1.104a3.81 3.81 0 0 0-.367-1H16a1 1 0 1 0 0-2H8z"
      clipRule="evenodd"
    />
  </svg>
);

const BalanceCoinsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    height="50"
    width="50"
    data-testid="balance"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 7h3m5 0h-5m5 3h-2m-6.003 0H14m-3-3c1 0 3 .6 3 3m-1 7-5.003-4H11c1 0 3-.6 3-3"
    />
  </svg>
);

function Rewards({ id }) {
  const [rewardsData, setRewardsData] = useState({
    rewardsEarned: 0.0,
    rewardsRedeemed: 0.0,
    rewardsBalance: 0.0,
  });

  useEffect(() => {
    const response = localStorage.getItem("jwt");
    const headers = {
      Authorization: `Bearer ${response}`,
      "Content-Type": "application/json",
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
        console.error("Error fetching reward details:", error);
      });
  }, [id]);

  return (
    <Paper elevation={3} sx={{ p: 2 }} style={{ backgroundColor: "#f9f9f9" }}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Box display="flex" alignItems="center">
            <EarnedCoinsIcon />
            &nbsp; &nbsp;
            <div>
              <Typography variant="h6">Earned Coins</Typography>
              <Typography variant="subtitle1">
                {rewardsData.rewardsEarned} coins
              </Typography>
            </div>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box display="flex" alignItems="center">
            <RedeemedCoinsIcon />
            &nbsp; &nbsp;
            <div>
              <Typography variant="h6">Redeemed Coins</Typography>
              <Typography variant="subtitle1">
                {rewardsData.rewardsRedeemed} coins
              </Typography>
            </div>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box display="flex" alignItems="center">
            <BalanceCoinsIcon />
            &nbsp; &nbsp;
            <div>
              <Typography variant="h6">Balance Coins</Typography>
              <Typography variant="subtitle1">
                {rewardsData.rewardsBalance} coins
              </Typography>
            </div>
          </Box>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" color="textPrimary">
        Note : Earned Coins represent the total coins earned, Redeemed Coins
        represent the coins spent or redeemed, and Balance Coins represent the
        remaining coins.
      </Typography>
    </Paper>
  );
}

export default Rewards;
