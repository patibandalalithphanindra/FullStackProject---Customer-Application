import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Paper, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import styles from './styles.module.css';
import { useNavigate, useParams } from 'react-router-dom';

function EditCustomer() {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const [customerData, setCustomerData] = useState({
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phoneNo: '',
    emailId: '',
    status: 'Active',
  });

  useEffect(() => {
    const response = localStorage.getItem('jwt');
    const headers = {
      Authorization: `Bearer ${response}`,
      'Content-Type': 'application/json',
    };

    axios
      .get(`http://localhost:8080/customers/${customerId}`, { headers })
      .then((response) => {
        const { data } = response;
        setCustomerData(data);
      })
      .catch((error) => {
        console.error('Error fetching customer data:', error);
      });
  }, [customerId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData({
      ...customerData,
      [name]: value,
    });
  };

  const handleSave = () => {
    const response = localStorage.getItem('jwt');
    const headers = {
      Authorization: `Bearer ${response}`,
      'Content-Type': 'application/json',
    };

    axios
      .put(`http://localhost:8080/customers/${customerId}`, customerData, {
        headers,
      })
      .then((response) => {
        navigate(`/customers/`);
      })
      .catch((error) => {
        console.error('Error updating customer data:', error);
      });
  };

  return (
    <div className={styles.editCustomerContainer}>
      <Typography variant="h5" gutterBottom>
        Update Customer Information
      </Typography>
      <Paper elevation={3} className={styles.form}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="firstName"
              label="First Name"
              value={customerData.firstName}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="lastName"
              label="Last Name"
              value={customerData.lastName}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="addressLine1"
              label="Address Line 1"
              value={customerData.addressLine1}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="addressLine2"
              label="Address Line 2"
              value={customerData.addressLine2}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="city"
              label="City"
              value={customerData.city}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="state"
              label="State"
              value={customerData.state}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="zipCode"
              label="Zip Code"
              value={customerData.zipCode}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="country"
              label="Country"
              value={customerData.country}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="phoneNo"
              label="Phone Number"
              value={customerData.phoneNo}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="emailId"
              label="Email"
              value={customerData.emailId}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={customerData.status}
                onChange={handleInputChange}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <div className={styles.saveButtonContainer}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          className={styles.saveButton}
        >
          Save
        </Button>
      </div>
      </Paper>
    </div>
  );
}

export default EditCustomer;
