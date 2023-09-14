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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
} from '@mui/material';
import axios from 'axios';
import styles from './styles.module.css';
import Navbar from '../common/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import { Search } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomerModal from './CustomerModal';
import { useNavigate } from 'react-router-dom';

function Customer() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteCustomerId, setDeleteCustomerId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
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
  const [modalMode, setModalMode] = useState('add');

  const fetchCustomerData = () => {
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
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const handleView = async (customerId) => {
    navigate(`/dashboard/${customerId}`);
  };

  const handleAddition = () => {
    setModalMode('add');
    setCustomerData({
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
    setIsCustomerModalOpen(true);
  };

  const handleUpdate = (customerId) => {
    setModalMode('edit');
    const customerToUpdate = customers.find((customer) => customer.customerId === customerId);
    setCustomerData(customerToUpdate);
    setIsCustomerModalOpen(true);
  };

  const handleSaveCustomer = async () => {
    const response = localStorage.getItem('jwt');
    const headers = {
      Authorization: `Bearer ${response}`,
      'Content-Type': 'application/json',
    };

    if (modalMode === 'add') {
      axios
        .post('http://localhost:8080/customers', customerData, {
          headers,
        })
        .then((response) => {
          if (response.status === 200 || response.status === 201 ) {
            toast.success('Customer has been added successfully');
            fetchCustomerData();
          } else {
            toast.error('An error occurred while adding the customer');
          }
        })
        .catch((error) => {
          console.error('Error adding customer:', error);
          toast.error('Failed to add the customer. Please try again.');
        });
    } else if (modalMode === 'edit') {
      axios
        .put(`http://localhost:8080/customers/${customerData.customerId}`, customerData, {
          headers,
        })
        .then((response) => {
          if (response.status === 200) {
            toast.success('Customer information has been updated successfully');
            fetchCustomerData();
          } else {
            toast.error('An error occurred while updating the customer');
          }
        })
        .catch((error) => {
          console.error('Error updating customer:', error);
          toast.error('Failed to update customer data. Please try again.');
        });
    }

    setIsCustomerModalOpen(false);
  };

  const handleDelete = (customerId) => {
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

  const renderCustomerModal = () => {
    return (
      <CustomerModal
        isOpen={isCustomerModalOpen}
        handleClose={() => setIsCustomerModalOpen(false)}
        customer={customerData}
        setCustomer={(data) => setCustomerData(data)}
        mode={modalMode}
        handleSave={handleSaveCustomer}
      />
    );
  };

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
        InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Search />
          </InputAdornment>
        ),
      }}
    />
        <Button
          style={{ maxWidth: '200px', maxHeight: '40px', marginTop: '8px' }}
          variant="contained"
          className={`${styles.button} ${styles.addCustomerButton}`}
          onClick={handleAddition}
        >
          <AddIcon/>
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
                    <VisibilityIcon />
                  </Button>
                  <Button
                    sx={{ mr: 2 }}
                    variant="contained"
                    color="success"
                    className={`${styles.button} ${styles.secondaryButton}`}
                    onClick={() => handleUpdate(customer.customerId)}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    className={`${styles.button} ${styles.tertiaryButton}`}
                    onClick={() => handleDelete(customer.customerId)}
                  >
                    <DeleteIcon />
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
      {renderCustomerModal()}
    </>
  );
}

export default Customer;
