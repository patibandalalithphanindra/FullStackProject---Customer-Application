import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Grid,
  FormHelperText,
} from "@mui/material";

const CustomerModal = ({
  isOpen,
  handleClose,
  customer,
  setCustomer,
  handleSave,
}) => {
  const [firstNameValid, setFirstNameValid] = useState(true);
  const [lastNameValid, setLastNameValid] = useState(true);
  const [addressLine1Valid, setAddressLine1Valid] = useState(true);
  const [cityValid, setCityValid] = useState(true);
  const [stateValid, setStateValid] = useState(true);
  const [zipCodeValid, setZipCodeValid] = useState(true);
  const [countryValid, setCountryValid] = useState(true);
  const [phoneNoValid, setPhoneNoValid] = useState(true);
  const [emailIdValid, setEmailIdValid] = useState(true);
  const [statusValid, setStatusValid] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setFirstNameValid(true);
      setLastNameValid(true);
      setAddressLine1Valid(true);
      setCityValid(true);
      setStateValid(true);
      setZipCodeValid(true);
      setCountryValid(true);
      setPhoneNoValid(true);
      setEmailIdValid(true);
      setStatusValid(true);
    }
  }, [isOpen]);

  const validateEmail = (email) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phoneNo) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNo);
  };

  const handleSaveClick = () => {
    if (
      customer.firstName &&
      customer.lastName &&
      customer.addressLine1 &&
      customer.city &&
      customer.state &&
      customer.zipCode &&
      customer.country &&
      validatePhoneNumber(customer.phoneNo) &&
      validateEmail(customer.emailId) &&
      customer.status
    ) {
      handleSave();
    } else {
      setFirstNameValid(!!customer.firstName);
      setLastNameValid(!!customer.lastName);
      setAddressLine1Valid(!!customer.addressLine1);
      setCityValid(!!customer.city);
      setStateValid(!!customer.state);
      setZipCodeValid(!!customer.zipCode);
      setCountryValid(!!customer.country);
      setPhoneNoValid(validatePhoneNumber(customer.phoneNo));
      setEmailIdValid(validateEmail(customer.emailId));
      setStatusValid(!!customer.status);
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>
        {customer.customerId
          ? "Edit an existing Customer"
          : "Add a new Customer"}
      </DialogTitle>
      <DialogContent style={{ paddingTop: "8px" }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              required
              value={customer.firstName}
              onChange={(e) =>
                setCustomer({ ...customer, firstName: e.target.value })
              }
              inputProps={{ "data-testid": "firstname" }}
            />
            {!firstNameValid && (
              <FormHelperText error>This field is required.</FormHelperText>
            )}
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              required
              value={customer.lastName}
              onChange={(e) =>
                setCustomer({ ...customer, lastName: e.target.value })
              }
              inputProps={{ "data-testid": "lastname" }}
            />
            {!lastNameValid && (
              <FormHelperText error>This field is required.</FormHelperText>
            )}
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Address Line 1"
              variant="outlined"
              fullWidth
              required
              value={customer.addressLine1}
              onChange={(e) =>
                setCustomer({ ...customer, addressLine1: e.target.value })
              }
              inputProps={{ "data-testid": "add1" }}
            />
            {!addressLine1Valid && (
              <FormHelperText error>This field is required.</FormHelperText>
            )}
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Address Line 2"
              variant="outlined"
              fullWidth
              value={customer.addressLine2}
              onChange={(e) =>
                setCustomer({ ...customer, addressLine2: e.target.value })
              }
              inputProps={{ "data-testid": "add2" }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="City"
              variant="outlined"
              fullWidth
              required
              value={customer.city}
              onChange={(e) =>
                setCustomer({ ...customer, city: e.target.value })
              }
              inputProps={{ "data-testid": "city" }}
            />
            {!cityValid && (
              <FormHelperText error>This field is required.</FormHelperText>
            )}
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="State"
              variant="outlined"
              fullWidth
              required
              value={customer.state}
              onChange={(e) =>
                setCustomer({ ...customer, state: e.target.value })
              }
              inputProps={{ "data-testid": "state" }}
            />
            {!stateValid && (
              <FormHelperText error>This field is required.</FormHelperText>
            )}
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Zip Code"
              variant="outlined"
              fullWidth
              required
              value={customer.zipCode}
              onChange={(e) =>
                setCustomer({ ...customer, zipCode: e.target.value })
              }
              inputProps={{ "data-testid": "zipcode" }}
            />
            {!zipCodeValid && (
              <FormHelperText error>This field is required.</FormHelperText>
            )}
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Country"
              variant="outlined"
              fullWidth
              required
              value={customer.country}
              onChange={(e) =>
                setCustomer({ ...customer, country: e.target.value })
              }
              inputProps={{ "data-testid": "country" }}
            />
            {!countryValid && (
              <FormHelperText error>This field is required.</FormHelperText>
            )}
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              required
              value={customer.phoneNo}
              disabled={customer.customerId !== undefined}
              onChange={(e) =>
                setCustomer({ ...customer, phoneNo: e.target.value })
              }
              inputProps={{ "data-testid": "phonenumber" }}
            />
            {!phoneNoValid && (
              <FormHelperText error>
                This field is required and must be 10 digits.
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              required
              value={customer.emailId}
              disabled={customer.customerId !== undefined}
              onChange={(e) =>
                setCustomer({ ...customer, emailId: e.target.value })
              }
              inputProps={{ "data-testid": "email" }}
            />
            {!emailIdValid && (
              <FormHelperText error>
                This field is required and must be a valid email address.
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={6}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={customer.status}
                onChange={(e) =>
                  setCustomer({ ...customer, status: e.target.value })
                }
                inputProps={{ "data-testid": "status" }}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
              {!statusValid && (
                <FormHelperText error>This field is required.</FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSaveClick} color="primary" data-testid="add">
          {customer.customerId ? "Save" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerModal;
