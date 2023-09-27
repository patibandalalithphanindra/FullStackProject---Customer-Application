import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  IconButton
} from '@mui/material';
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";

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

  const sortIcon = ascending ? <ArrowDownward /> : <ArrowUpward />;

  useEffect(() => {
    setSortedOrders(orders);
  }, [orders]);

  return (
    <Paper elevation={1} className={styles.container}>
      {sortedOrders.length > 0 ? (
        <TableContainer component={Paper} className={styles.table}>
          <Table>
            <TableHead className={styles.header}>
              <TableRow>
                <TableCell><b>Order No</b></TableCell>
                <TableCell>
                  <b>Date</b>
                  <IconButton
                    onClick={toggleSort}
                    color="inherit"
                    size="small"
                    aria-label="sort"
                  >
                    {sortIcon}
                  </IconButton>
                </TableCell>
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
                  <TableCell>{order.currency} {order.orderTotal}</TableCell>
                  <TableCell>{order.orderStatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <h3 className={styles.nodata}>No orders have been placed by the customer!</h3>
      )}
    </Paper>
  );
};

export default Orders;
