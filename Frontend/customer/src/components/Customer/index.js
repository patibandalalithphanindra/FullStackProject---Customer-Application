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
  TablePagination,
  IconButton,
} from '@mui/material';
import axios from 'axios';
import styles from './styles.module.css';
import Navbar from '../common/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import { Search, ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomerModal from './CustomerModal';
import { useNavigate } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';

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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortedCustomers, setSortedCustomers] = useState([]);
  const [copiedCustomerId, setCopiedCustomerId] = useState(null);
  const [error, setError] = useState(null); 

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
        setSortedCustomers([...response.data]);
      })
      .catch((error) => {
        setError('Error fetching data. Please try again!');
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

    if (!customerData.customerId) {
      axios
        .post('http://localhost:8080/customers', customerData, {
          headers,
        })
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            toast.success('Customer has been added successfully', {
              position: toast.POSITION.BOTTOM_LEFT, autoClose: 900
            });
            fetchCustomerData();
          } else {
            toast.error('An error occurred while adding the customer', {
              position: toast.POSITION.BOTTOM_LEFT, autoClose: 900
            });
          }
        })
        .catch((error) => {
          console.error('Error adding customer:', error);
          toast.error('Failed to add the customer. Please try again.', {
            position: toast.POSITION.BOTTOM_LEFT, autoClose: 900
          });
        });
    } else if (customerData.customerId) {
      axios
        .put(`http://localhost:8080/customers/${customerData.customerId}`, customerData, {
          headers,
        })
        .then((response) => {
          if (response.status === 200) {
            toast.success('Customer information has been updated successfully', {
              position: toast.POSITION.BOTTOM_LEFT, autoClose: 900
            });
            fetchCustomerData();
          } else {
            toast.error('An error occurred while updating the customer', {
              position: toast.POSITION.BOTTOM_LEFT, autoClose: 900
            });
          }
        })
        .catch((error) => {
          console.error('Error updating customer:', error);
          toast.error('Failed to update customer data. Please try again.', {
            position: toast.POSITION.BOTTOM_LEFT, autoClose: 900
          });
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
          toast.success('Customer has been deleted successfully', {
            position: toast.POSITION.BOTTOM_LEFT, autoClose: 900
          });
          fetchCustomerData();
        } else {
          toast.error('An error occurred while deleting the customer', {
            position: toast.POSITION.BOTTOM_LEFT, autoClose: 900
          });
        }
        setIsDeleteModalOpen(false);
      })
      .catch((error) => {
        console.error(`Error deleting the customer ${deleteCustomerId}: ${error.message}`);
        toast.error('Customer is in Active status, Hence cannot be deleted!', {
          position: toast.POSITION.BOTTOM_LEFT, autoClose: 900
        });
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

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredCustomers.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getVisibleCustomers = () => {
    if (searchQuery) {
      return customers.filter((customer) =>
        customer.firstName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      const sorted = [...sortedCustomers].sort((a, b) => {
        const nameA = a.firstName.toLowerCase();
        const nameB = b.firstName.toLowerCase();
  
        if (sortOrder === 'asc') {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      });
  
      const startIndex = page * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      return sorted.slice(startIndex, endIndex);
    }
  };
  
  const handleSort = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';

    const sorted = [...sortedCustomers].sort((a, b) => {
      const nameA = a.firstName.toLowerCase();
      const nameB = b.firstName.toLowerCase();

      if (newSortOrder === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

    setSortOrder(newSortOrder);
    setSortedCustomers(sorted);
  };

  const renderCustomerModal = () => {
    return (
      <CustomerModal
        isOpen={isCustomerModalOpen}
        handleClose={() => setIsCustomerModalOpen(false)}
        customer={customerData}
        setCustomer={(data) => setCustomerData(data)}
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
        <div className={styles.actionsContainer}>
          <div className={styles.search}>
            <label className={styles.label}>Search for a Customer : </label>
            <TextField
              label="Search Name"
              id="filled-basic"
              size="small"
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
          </div>
          <Button
            style={{ maxWidth: '200px', maxHeight: '40px', marginTop: '8px' }}
            variant="contained"
            className={`${styles.button} ${styles.addCustomerButton}`}
            onClick={handleAddition}
            data-testid="add-button"
          >
            <AddIcon />
          </Button>
        </div>
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
                <IconButton
                  onClick={handleSort}
                  color="inherit"
                  size="small"
                  aria-label="sort"
                >
                  {sortOrder === 'asc' ? (
                    <ArrowUpwardIcon />
                  ) : (
                    <ArrowDownwardIcon />
                  )}
                </IconButton>
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
              <TableCell>
                <b>Place an Order</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getVisibleCustomers().map((customer) => (
              <TableRow key={customer.customerId} className={styles.tableRow}>
                <TableCell>{customer.customerId}</TableCell>
                <TableCell data-testid="customername">{customer.firstName}</TableCell>
                <TableCell>{customer.emailId}</TableCell>
                <TableCell>{customer.phoneNo}</TableCell>
                <TableCell>
                  <Button
                    sx={{ mr: 2 }}
                    variant="contained"
                    color="primary"
                    className={`${styles.button} ${styles.primaryButton}`}
                    onClick={() => handleView(customer.customerId)}
                    data-testid={`viewicon-${customer.customerId}`} 
                  >
                    <VisibilityIcon />
                  </Button>
                  <Button
                    sx={{ mr: 2 }}
                    variant="contained"
                    color="success"
                    className={`${styles.button} ${styles.secondaryButton}`}
                    onClick={() => handleUpdate(customer.customerId)}
                    data-testid={`editicon-${customer.customerId}`} 
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    className={`${styles.button} ${styles.tertiaryButton}`}
                    onClick={() => handleDelete(customer.customerId)}
                    data-testid={`deleteicon-${customer.customerId}`} 
                  >
                    <DeleteIcon />
                  </Button>
                </TableCell>
                <TableCell>
                  <CopyToClipboard
                    text={customer.customerId}
                    onCopy={() => {
                      setCopiedCustomerId(customer.customerId);
                      navigate('/orders');
                    }}
                  >
                    <Button
                      variant="contained"
                      color="secondary"
                      className={`${styles.button}`}
                      data-testid={`copyicon-${customer.customerId}`} 
                    >
                      <AddIcon/>
                    </Button>
                  </CopyToClipboard>
                  {copiedCustomerId === customer.customerId && (
                    <span style={{ marginLeft: '8px', color: 'green' }}>
                      Customer Id copied successfully!
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
        {error && <h4 style={{display:"flex", justifyContent:"center"}}>{error}</h4>}
      </TableContainer>
      <Dialog open={isDeleteModalOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this customer?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary" data-testid="cancel">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirmation} color="error" data-testid="delete">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
      {renderCustomerModal()}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, { label: 'All', value: sortedCustomers.length }]}
        component="div"
        count={sortedCustomers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}

export default Customer;
