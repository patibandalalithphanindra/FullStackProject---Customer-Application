import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from '@mui/material';
import axios from 'axios';
import styles from './styles.module.css'; 
import Navbar from '../common/Navbar';

function Customer() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const response = localStorage.getItem('jwt');
    const headers = {
      Authorization: `Bearer ${response}`,
      'Content-Type': 'application/json',
    };

    axios
      .get('http://localhost:8080/customers', { headers })
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching customer data:', error);
      });
  }, []);

  const handleAddition = () => {

  };

  const handleDelete = async (customerId) => {
    console.log(Headers);
    try {
        await axios.delete(`http://localhost:8080/customers/${customerId}`);
    } catch (error) {
        console.error("Error deleting student:", error);
    }
};

  const handleUpdate = (customerId) => {
   
  };

  const handleView = (customerId) => {
    
  };

  return (
    <>
    <Navbar/>
    <div className={styles.headingContainer}>
        <h3 className={styles.heading}><b>CUSTOMERS INFORMATION</b></h3>
        <Button
        style={{maxWidth: '200px', maxHeight: '40px', marginTop : '8px'}}
          variant="contained"
          className={`${styles.button} ${styles.addCustomerButton}`}
          onClick={handleAddition}
        >
          Add Customer
        </Button>
      </div>
    <TableContainer component={Paper} className={styles.container}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><b>Customer ID</b></TableCell>
            <TableCell><b>Name</b></TableCell>
            <TableCell><b>Email</b></TableCell>
            <TableCell><b>Phone Number</b></TableCell>
            <TableCell><b>Actions</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.customerId} className={styles.tableRow}>
              <TableCell>{customer.customerId}</TableCell>
              <TableCell>{customer.firstName}</TableCell>
              <TableCell>{customer.emailId}</TableCell>
              <TableCell>{customer.phoneNo}</TableCell>
              <TableCell>
                <Button
                  sx={{mr:2}}
                  variant="contained"
                  color="primary"
                  className={`${styles.button} ${styles.primaryButton}`}
                  onClick={() => handleView(customer.customerId)}
                >
                  View
                </Button>
                <Button
                  sx={{mr:2}}
                  variant="contained"
                  color="success"
                  className={`${styles.button} ${styles.secondaryButton}`}
                  onClick={() => handleUpdate(customer.customerId)}
                >
                  Update
                </Button>
                <Button
                  variant="contained"
                  color="error"
                className={`${styles.button} ${styles.tertiaryButton}`}
                  onClick={() => handleDelete(customer.customerId)}
                >
                Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
};

export default Customer;
