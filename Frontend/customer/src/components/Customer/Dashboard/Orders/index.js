import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, Typography, TableContainer } from '@mui/material';

const Orders = ({ orders }) => {
  const formatDate = (dateString) => {
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    
    return new Date(dateString).toLocaleString(undefined, options);
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
      <Typography variant="h6">Order History</Typography>
      {orders.length>0 ? <TableContainer component={Paper} style={{ maxHeight: 200 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Rewards</TableCell>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {orders.map((order) => (
            <TableRow key={order.orderKey}>
              <TableCell>{order.orderNo}</TableCell>
              <TableCell>{formatDate(order.orderDate)}</TableCell>
              <TableCell>{order.reward.rewardsEarned}</TableCell>
              <TableCell>${order.orderTotal}</TableCell>
            </TableRow>
          ))} 
        </TableBody> 
      </Table>
      </TableContainer> : <h3>No orders have been placed by the customer!</h3> }
    </Paper>
  );
};

export default Orders;