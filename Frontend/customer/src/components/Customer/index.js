import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import axios from 'axios';
import styles from './styles.module.css';
import Navbar from '../common/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Customer() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteCustomerId, setDeleteCustomerId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
    navigate(`/customer/add`);
  };

  const handleView = async (customerId) => {
    
  };

  const handleUpdate = async (customerId) => {
    navigate(`/customers/${customerId}/edit`);
  };

  const handleDelete = async (customerId) => {
    setDeleteCustomerId(customerId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirmation = () => {
    const response = localStorage.getItem('jwt');
    const headers = {
      Authorization: `Bearer ${response}`,
      'Content-Type': 'application/json',
    };
    axios
      .delete(`http://localhost:8080/customers/${deleteCustomerId}`, { headers })
      .then((response) => {
        if (response.status === 200) {
          toast.success('Customer has been deleted successfully');
          setCustomers((prevItems) =>
            prevItems.filter((customer) => customer.customerId !== deleteCustomerId)
          );
        } else {
          toast.error('An error occurred while deleting the customer');
        }
        setIsDeleteModalOpen(false);
      })
      .catch((error) => {
        console.error(`Error deleting the customer ${deleteCustomerId}: ${error.message}`);
        toast.error('Customer is in Active status, Hence cannot be deleted!');
        setIsDeleteModalOpen(false);
      });
  };
  
  const handleDeleteCancel = () => {
    setDeleteCustomerId(null);
    setIsDeleteModalOpen(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className={styles.headingContainer}>
        <h3 className={styles.heading}>
          <b>CUSTOMERS INFORMATION</b>
        </h3>
        <TextField
          label="Search Name"
          id="filled-basic"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          className={styles.search}
        />
        <Button
          style={{ maxWidth: '200px', maxHeight: '40px', marginTop: '8px' }}
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
              <TableCell>
                <b>Customer ID</b>
              </TableCell>
              <TableCell>
                <b>Name</b>
              </TableCell>
              <TableCell>
                <b>Email</b>
              </TableCell>
              <TableCell>
                <b>Phone Number</b>
              </TableCell>
              <TableCell>
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.customerId} className={styles.tableRow}>
                <TableCell>{customer.customerId}</TableCell>
                <TableCell>{customer.firstName}</TableCell>
                <TableCell>{customer.emailId}</TableCell>
                <TableCell>{customer.phoneNo}</TableCell>
                <TableCell>
                  <Button
                    sx={{ mr: 2 }}
                    variant="contained"
                    color="primary"
                    className={`${styles.button} ${styles.primaryButton}`}
                    onClick={() => handleView(customer.customerId)}
                  >
                    View
                  </Button>
                  <Button
                    sx={{ mr: 2 }}
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
      <Dialog open={isDeleteModalOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this customer?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirmation} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  );
}

export default Customer;
