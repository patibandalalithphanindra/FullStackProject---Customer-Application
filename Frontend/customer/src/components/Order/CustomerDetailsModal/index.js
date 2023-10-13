import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

function CustomerDetailsModal({ customerId, isOpen, handleClose }) {
  const [customerData, setCustomerData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && customerId) {
      setIsLoading(true);
      const response = localStorage.getItem("jwt");
      const headers = {
        Authorization: `Bearer ${response}`,
        "Content-Type": "application/json",
      };

      axios
        .get(`http://localhost:8080/customers/${customerId}`, { headers })
        .then((response) => {
          setCustomerData(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(`Error fetching customer data: ${error.message}`);
          setIsLoading(false);
        });
    }
  }, [isOpen, customerId]);

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Customer Details</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <div style={{ textAlign: "center" }}>
            <CircularProgress />
          </div>
        ) : (
          customerData && (
            <>
              <div>
                <Typography variant="body1">
                  <b>Customer ID : </b> {customerData.customerId}
                </Typography>
              </div>
              <div>
                <Typography variant="body1">
                  <b>Name : </b> {customerData.firstName}{" "}
                  {customerData.lastName}
                </Typography>
              </div>
              <div>
                <Typography variant="body1">
                  <b>Phone No : </b> {customerData.phoneNo}
                </Typography>
              </div>
              <div>
                <Typography variant="body1">
                  <b>Email ID : </b> {customerData.emailId}
                </Typography>
              </div>
              <div>
                <Typography variant="body1">
                  <b>Address : </b> {customerData.addressLine1},{" "}
                  {customerData.addressLine2}
                </Typography>
              </div>
              <div>
                <Typography variant="body1">
                  <b>City : </b> {customerData.city}
                </Typography>
              </div>
              <div>
                <Typography variant="body1">
                  <b>State : </b> {customerData.state}
                </Typography>
              </div>
              <div>
                <Typography variant="body1">
                  <b>Zip Code : </b> {customerData.zipCode}
                </Typography>
              </div>
              <div>
                <Typography variant="body1">
                  <b>Country : </b> {customerData.country}
                </Typography>
              </div>
              <div>
                <Typography variant="body1">
                  <b>Status : </b> {customerData.status}
                </Typography>
              </div>
            </>
          )
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CustomerDetailsModal;
