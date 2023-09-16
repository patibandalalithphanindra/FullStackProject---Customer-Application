import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,

  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel
} from '@mui/material';

const OrderModal = ({
  isOpen,
  handleClose,
  orderData,
  withCoins,
  setWithCoins,
  setOrderData,
  handleSave,
}) => {
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>{orderData.orderNo ? 'Edit Order' : 'Add Order'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <div>
            <TextField
              label="Customer ID"
              variant="outlined"
              fullWidth
              margin="normal"
              value={orderData.customerId}
              onChange={(e) => setOrderData({ ...orderData, customerId: e.target.value })}
            />
            </div>
          <div>
            <TextField
              label="Total Items"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={orderData.totalItems}
              onChange={(e) => setOrderData({ ...orderData, totalItems: e.target.value })}
            />
            </div>
          <div>
            <TextField
              label="Order Total"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={orderData.orderTotal}
              onChange={(e) => setOrderData({ ...orderData, orderTotal: e.target.value })}
            />
          </div>
          <div>

            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel htmlFor="currency">Currency</InputLabel>
              <Select
                label="Currency"
                value={orderData.currency}
                onChange={(e) => setOrderData({ ...orderData, currency: e.target.value })}
              >
                <MenuItem value="INR">INR</MenuItem>
                <MenuItem value="$">$</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div>

            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel htmlFor="withCoins">With Coins</InputLabel>
              <Select
                label="withCoins"
                value={withCoins}
                onChange={(e) => setWithCoins(e.target.value)}
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div>
            <TextField
              label="Customer Phone Number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={orderData.customerPhoneNo}
              onChange={(e) => setOrderData({ ...orderData, customerPhoneNo: e.target.value })}
            />
          </div>
          <div>
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel htmlFor="orderStatus">Order Status</InputLabel>
              <Select
                label="Order Status"
                value={orderData.orderStatus}
                onChange={(e) => setOrderData({ ...orderData, orderStatus: e.target.value })}
              >
                <MenuItem value="Created">Created</MenuItem>
                <MenuItem value="Shipped">Shipped</MenuItem>
              </Select>
            </FormControl>
          </div>

        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderModal;