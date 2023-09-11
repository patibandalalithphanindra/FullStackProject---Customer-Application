import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import axios from 'axios';
import styles from './styles.module.css';
import { useNavigate, useParams } from 'react-router-dom';

function EditCustomer() {
  const navigate = useNavigate();
  const { customerId } = useParams(); 
  console.log(customerId, 'customerId');
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
        console.log(response);
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
        console.log('Customer data updated successfully:', response.data);
        navigate("http://localhost:8080/customers/");
        
      })
      .catch((error) => {
        console.error('Error updating customer data:', error);
      });
  };

  return (
    <div className={styles.editCustomerContainer}>
      <h3>Update Customer Information</h3>
      <form className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label>First Name:</label>
            <TextField
              name="firstName"
              value={customerData.firstName}
              onChange={handleInputChange}
              fullWidth
            />
          </div>
          <div className={styles.formField}>
            <label>Last Name:</label>
            <TextField
              name="lastName"
              value={customerData.lastName}
              onChange={handleInputChange}
              fullWidth
            />
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label>Address Line 1:</label>
            <TextField
              name="addressLine1"
              value={customerData.addressLine1}
              onChange={handleInputChange}
              fullWidth
            />
          </div>
          <div className={styles.formField}>
            <label>Address Line 2:</label>
            <TextField
              name="addressLine2"
              value={customerData.addressLine2}
              onChange={handleInputChange}
              fullWidth
            />
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label>City:</label>
            <TextField
              name="city"
              value={customerData.city}
              onChange={handleInputChange}
              fullWidth
            />
          </div>
          <div className={styles.formField}>
            <label>State:</label>
            <TextField
              name="state"
              value={customerData.state}
              onChange={handleInputChange}
              fullWidth
            />
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label>Zip Code:</label>
            <TextField
              name="zipCode"
              value={customerData.zipCode}
              onChange={handleInputChange}
              fullWidth
            />
          </div>
          <div className={styles.formField}>
            <label>Country:</label>
            <TextField
              name="country"
              value={customerData.country}
              onChange={handleInputChange}
              fullWidth
            />
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label>Phone Number:</label>
            <TextField
              name="phoneNo"
              value={customerData.phoneNo}
              onChange={handleInputChange}
              fullWidth
            />
          </div>
          <div className={styles.formField}>
            <label>Email:</label>
            <TextField
              name="emailId"
              value={customerData.emailId}
              onChange={handleInputChange}
              fullWidth
            />
          </div>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          className={styles.saveButton}
        >
          Save
        </Button>
      </form>
    </div>
  );
}

export default EditCustomer;
