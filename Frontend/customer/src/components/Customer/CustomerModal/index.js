import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import styles from './styles.module.css';

function CustomerModal({ isOpen, handleClose, customer, setCustomer, mode, handleSave }) {
  const isEditMode = mode === 'edit';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({
      ...customer,
      [name]: value,
    });
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>{ isEditMode ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
      <DialogContent className={styles.form}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              name="firstName"
              label="First Name"
              fullWidth
              value={customer?.firstName}
              onChange={handleChange}
              className={styles.formField}
              autoFocus={!isEditMode}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="lastName"
              label="Last Name"
              fullWidth
              value={customer?.lastName}
              onChange={handleChange}
              className={styles.formField}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="addressLine1"
              label="Address Line 1"
              fullWidth
              value={customer.addressLine1}
              onChange={handleChange}
              className={styles.formField}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="addressLine2"
              label="Address Line 2"
              fullWidth
              value={customer?.addressLine2}
              onChange={handleChange}
              className={styles.formField}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="city"
              label="City"
              fullWidth
              value={customer?.city}
              onChange={handleChange}
              className={styles.formField}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="state"
              label="State"
              fullWidth
              value={customer?.state}
              onChange={handleChange}
              className={styles.formField}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="zipCode"
              label="Zip Code"
              fullWidth
              value={customer?.zipCode}
              onChange={handleChange}
              className={styles.formField}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="country"
              label="Country"
              fullWidth
              value={customer?.country}
              onChange={handleChange}
              className={styles.formField}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="phoneNo"
              label="Phone Number"
              fullWidth
              value={customer?.phoneNo}
              onChange={handleChange}
              className={styles.formField}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="emailId"
              label="Email"
              fullWidth
              value={customer?.emailId}
              onChange={handleChange}
              className={styles.formField}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={customer?.status}
                onChange={handleChange}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
        {isEditMode && (
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        )}
        {!isEditMode && (
          <Button onClick={handleSave} color="primary">
            Add
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default CustomerModal;
