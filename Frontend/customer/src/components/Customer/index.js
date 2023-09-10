import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import axios from 'axios';

const Customer = () => {
  const [customers, setCustomers] = useState([
    {
  //   "id":"1",
  //   "name":"ram",
  //   "email":"ram@gmail.com",
  //   "phone":"9182353050"
  // },
  // {
  //   "id":"2",
  //   "name":"sai",
  //   "email":"sai@gmail.com",
  //   "phone":"9172353050"
  }
]);
  

  useEffect(() => {
    // Replace 'backend-api-url' with the actual URL to fetch customer data.
    const response = localStorage.getItem("jwt");

    const headers = {
      Authorization: `Bearer ${response}`,
     "Content-Type": "application/json",
    };

    axios.get('http://localhost:8080/customers', { headers })
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching customer data:', error);
      });
  }, []);

  const handleDelete = (customerId) => {
    // Implement the delete logic here, sending a DELETE request to the backend.
  };

  const handleUpdate = (customerId) => {
    // Implement the update logic here, navigate to an update page or show a modal.
  };

  const handleView = (customerId) => {
    // Implement the view logic here, navigate to a customer details page or show a modal.
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone No</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.customerId}>
              <TableCell>{customer.firstName}</TableCell>
              <TableCell>{customer.emailId}</TableCell>
              <TableCell>{customer.phoneNo}</TableCell>
              <TableCell>
                <Button variant="outlined" color="primary" onClick={() => handleView(customer.customerId)}>View</Button>
                <Button variant="outlined" color="secondary" onClick={() => handleDelete(customer.customerId)}>Delete</Button>
                <Button variant="outlined" color="primary" onClick={() => handleUpdate(customer.customerId)}>Update</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Customer;