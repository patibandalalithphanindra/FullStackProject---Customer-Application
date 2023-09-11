import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
} from '@mui/material';
import axios from 'axios';
import styles from './styles.module.css'; 
import Navbar from '../common/Navbar';

function Order() {
  const [orders, setOrders] = useState([]);
  const [searchCustomerId, setSearchCustomerId] = useState('');

  useEffect(() => {
    const response = localStorage.getItem('jwt');
    const headers = {
      Authorization: `Bearer ${response}`,
      'Content-Type': 'application/json',
    };

    axios
      .get('http://localhost:8080/orders', { headers })
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error('Error fetching order data:', error);
      });
  }, []);

  const handleAddition = () => {
  
  };

  const handleUpdate = (orderNo) => {
   
  };

  const handleView = (orderNo) => {
    
  };

  const handleSearch = (e) => {
    setSearchCustomerId(e.target.value);
  };

  const filteredOrders = orders.filter((order) =>
    order.customerId.includes(searchCustomerId)
  );

  return (
    <>
      <Navbar />
      <div className={styles.headingContainer}>
        <h3 className={styles.heading}>
          <b>ORDERS INFORMATION</b>
        </h3>
        <TextField
          label="Search Customer ID"
          variant="outlined"
          value={searchCustomerId}
          onChange={handleSearch}
        />
        <Button
          style={{ maxWidth: '200px', maxHeight: '40px', marginTop: '8px' }}
          variant="contained"
          className={`${styles.button} ${styles.addOrderButton}`}
          onClick={handleAddition}
        >
          Add Order
        </Button>
      </div>
      <TableContainer component={Paper} className={styles.container}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Order No</b>
              </TableCell>
              <TableCell>
                <b>Customer ID</b>
              </TableCell>
              <TableCell>
                <b>Total Order Amount</b>
              </TableCell>
              <TableCell>
                <b>Order Status</b>
              </TableCell>
              <TableCell>
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.orderNo} className={styles.tableRow}>
                <TableCell>{order.orderNo}</TableCell>
                <TableCell>{order.customerId}</TableCell>
                <TableCell>{order.orderTotal}</TableCell>
                <TableCell>{order.orderStatus}</TableCell>
                <TableCell>
                  <Button
                    sx={{ mr: 2 }}
                    variant="contained"
                    color="primary"
                    className={`${styles.button} ${styles.primaryButton}`}
                    onClick={() => handleView(order.orderNo)}
                  >
                    View
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    className={`${styles.button} ${styles.secondaryButton}`}
                    onClick={() => handleUpdate(order.orderNo)}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default Order;
