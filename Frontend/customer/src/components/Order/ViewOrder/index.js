import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import {  Link,useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './styles.module.css';

function ViewOrder() {
  const { orderNo } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const response = localStorage.getItem('jwt');
    const headers = {
      Authorization: `Bearer ${response}`,
      'Content-Type': 'application/json',
    };

    axios
      .get(`http://localhost:8080/orders/byOrder/${orderNo}`, { headers })
      .then((response) => {
        setOrder(response.data);
      })
      .catch((error) => {
        console.error('Error fetching order data:', error);
      });
  }, [orderNo]);

  return (
    <div className={styles.viewOrderContainer}>
      <Link to="/orders" className={styles.backLink}>
        &lt; Back to Orders
      </Link>
      {order && (
        <div className={styles.orderInfo}>
          <Typography variant="h4" className={styles.title}>
            Order Information
          </Typography>
          <Paper elevation={3} className={styles.card}>
            <Card className={styles.cardContent}>
              <CardContent>
                <Typography variant="h6" className={styles.cardTitle}>
                  Order No: {order?.orderNo}
                </Typography>
                <Typography variant="body1" className={styles.infoText}>
                  <b>Customer ID : </b>{order?.customerId}
                </Typography>
                <Typography variant="body1" className={styles.infoText}>
                  <b>Total Order Amount : </b> {order?.orderTotal.toFixed(2)}{order.currency}
                </Typography>
                <Typography variant="body1" className={styles.infoText}>
                  <b>Order Status : </b> {order?.orderStatus}
                </Typography>
                <Typography variant="body1" className={styles.infoText}>
                  <b>Customer Phone Number : </b> {order?.customerPhoneNo}
                </Typography>
                <Typography variant="body1" className={styles.infoText}>
                  <b>Order Date : {' '}</b>
                  {new Date(order.orderDate).toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </Typography>
                <Typography variant="body1" className={styles.infoText}>
                  <b>Last Modified : {' '}</b>
                  {new Date(order?.lastModifiedTS).toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </div>
      )}
    </div>
  );
}

export default ViewOrder;
