import React from 'react';
import { Link } from 'react-router-dom'; // If you are using React Router for navigation
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const HomePage = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom align='center' padding={5}>
        Home Page
      </Typography>
      <Box display="flex" justifyContent="space-around" paddingTop={5} >
        <Link to="/customers">
          <Paper elevation={3} style={{ padding: '20px', cursor: 'pointer' }}>
            <Typography variant="h6">Customers</Typography>
          </Paper>
        </Link>
        <Link to="/orders">
          <Paper elevation={3} style={{ padding: '20px', cursor: 'pointer' }}>
            <Typography variant="h6">Orders</Typography>
          </Paper>
        </Link>
        <Link to="/rewards">
          <Paper elevation={3} style={{ padding: '20px', cursor: 'pointer' }}>
            <Typography variant="h6">Rewards</Typography>
          </Paper>
        </Link>
      </Box>
    </div>
  );
};

export default HomePage;