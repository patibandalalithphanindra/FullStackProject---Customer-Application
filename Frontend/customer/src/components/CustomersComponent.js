// CustomerList.js
import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import UserService from '../service/api'

const CustomersComponent = () => {
  const [customers, setCustomers] = useState([ ]);

  useEffect(() => {
    // Make an API request to fetch customer data from your backend
    UserService.getCustomers() // Replace '/api/customers' with your actual API endpoint
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching customer data:', error);
      });
  }, []);

  return (
    <div>
      <h2>Customer List</h2>
      <List>
        {customers.map((customer) => (
          <ListItem key={customer.customerKey}>
            <ListItemText primary={customer.firstName} secondary={customer.emailId} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default CustomersComponent;
