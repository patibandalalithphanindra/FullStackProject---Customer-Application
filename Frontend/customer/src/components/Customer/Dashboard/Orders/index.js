import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Typography
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import styles from './styles.module.css';

const Orders = ({ orders }) => {
  const [sortedOrders, setSortedOrders] = useState(orders);
  const [ascending, setAscending] = useState(true);

  const formatDate = (dateString) => {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const toggleSort = () => {
    const newOrder = ascending
      ? [...sortedOrders].sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate))
      : [...sortedOrders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    setAscending(!ascending);
    setSortedOrders(newOrder);
  };

  const sortIcon = ascending ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />;

  useEffect(() => {
    setSortedOrders(orders);
  }, [orders]);

  return (
    <Paper elevation={1} className={styles.container}>
      <div className={styles.title}>
        <Typography variant="h6" className={styles.titleText}>Orders Information</Typography>
        <Typography
          className={styles.sortButton}
          onClick={toggleSort}
          style={{ cursor: 'pointer', textDecoration: 'none' }}
        >
          Sort by {sortIcon}
        </Typography>
      </div>
      {sortedOrders.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
              <TableCell><b>Order No</b></TableCell>
            <TableCell><b>Date</b></TableCell>
            <TableCell><b>Rewards Earned</b></TableCell>
            <TableCell><b>Rewards Redeemed</b></TableCell>
            <TableCell><b>Total Items</b></TableCell>
            <TableCell><b>Total Order Value</b></TableCell>
            <TableCell><b>Order Status</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedOrders.map((order) => (
                <TableRow key={order.orderKey}>
                  <TableCell>{order.orderNo}</TableCell>
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                  <TableCell>{order.reward.rewardsEarned}</TableCell>
                  <TableCell>{order.reward.rewardsRedeemed}</TableCell>
                  <TableCell>{order.totalItems}</TableCell>
                  <TableCell>{order.orderTotal} {order.currency}</TableCell>
                  <TableCell>{order.orderStatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <h3>No orders have been placed by the customer!</h3>
      )}
    </Paper>
  );
};

export default Orders;
