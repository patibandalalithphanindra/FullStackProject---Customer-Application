import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  IconButton,
} from "@mui/material";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";

import styles from "./styles.module.css";

function Orders({ orders }) {
  const [ascending, setAscending] = useState(true);

  const formatDate = (dateString) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const toggleSort = () => {
    setAscending(!ascending);
  };

  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.orderDate);
    const dateB = new Date(b.orderDate);
    return ascending ? dateA - dateB : dateB - dateA;
  });

  const sortIcon = ascending ? <ArrowUpward /> : <ArrowDownward />;

  return (
    <Paper elevation={1} className={styles.container}>
      {sortedOrders.length > 0 ? (
        <TableContainer component={Paper} className={styles.table}>
          <Table>
            <TableHead
              className={styles.header}
              style={{ backgroundColor: "#f0f0f0" }}
            >
              <TableRow>
                <TableCell>
                  <b>Order No</b>
                </TableCell>
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
                <TableCell style={{ textAlign: "right" }}>
                  <b>Rewards Earned</b>
                </TableCell>
                <TableCell style={{ textAlign: "right" }}>
                  <b>Rewards Redeemed</b>
                </TableCell>
                <TableCell style={{ textAlign: "right" }}>
                  <b>Total Items</b>
                </TableCell>
                <TableCell style={{ textAlign: "right" }}>
                  <b>Total Order Value</b>
                </TableCell>
                <TableCell>
                  <b>Order Status</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedOrders.map((order, index) => (
                <TableRow key={index}>
                  <TableCell>{order.orderNo}</TableCell>
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {order.reward.rewardsEarned}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {order.reward.rewardsRedeemed}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {order.totalItems}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {order.currency} {order.orderTotal}
                  </TableCell>
                  <TableCell>{order.orderStatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <h3 className={styles.nodata} style={{ backgroundColor: "#f0f0f0" }}>
          No orders have been placed by the customer!
        </h3>
      )}
    </Paper>
  );
}

export default Orders;
