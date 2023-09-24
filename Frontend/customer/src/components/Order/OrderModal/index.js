import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Select,
  Typography,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Grid,
  FormHelperText,
  Chip,
} from '@mui/material';
import styles from './styles.module.css';

const OrderModal = ({
  isOpen,
  handleClose,
  orderData,
  orderItemsMenu,
  orderItemsD,
  setOrderItemsD,
  withCoins,
  setWithCoins,
  setOrderData,
  handleSave,
}) => {
  const [customerIdValid, setCustomerIdValid] = useState(true);
  const [currencyValid, setCurrencyValid] = useState(true);
  const [withCoinsValid, setWithCoinsValid] = useState(true);
  const [orderStatusValid, setOrderStatusValid] = useState(true);
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity,setQuantity]=useState('');

  const [itemSelectionOpen, setItemSelectionOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCustomerIdValid(true);
  
      setCurrencyValid(true);
      setWithCoinsValid(true);
      setOrderStatusValid(true);
    }
  }, [isOpen]);

  const openItemSelection = () => {
    setItemSelectionOpen(true);
  };

  const closeItemSelection = () => {
    setItemSelectionOpen(false);
  };

  const addItemWithQuantity = () => {
    if (selectedItem && quantity > 0) {
      const newItem = {
        itemId: selectedItem.itemId,
        itemName:selectedItem.itemName,
        quantity: quantity,
      };
      setOrderItemsD([...orderItemsD, newItem]);

      setSelectedItem('');
      setQuantity('');
      closeItemSelection();
    }
  };

  const removeItem = (itemId) => {
    const updatedItems = orderItemsD.filter((item) => item.itemId !== itemId);
    setOrderItemsD(updatedItems);
  };

  const handleSaveClick = () => {
    if (
      orderData.customerId &&
      orderData.currency &&
      withCoins &&
      orderItemsD &&
      orderData.orderStatus
    ) {
      handleSave();
    } else {
      setCustomerIdValid(!!orderData.customerId);
      setCurrencyValid(!!orderData.currency);
      setWithCoinsValid(!!withCoins);
      setOrderItemsD(!!orderItemsD);
      setOrderStatusValid(!!orderData.orderStatus);
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>{orderData.orderNo ? 'Edit an existing Order' : 'Add a new Order'}</DialogTitle>
      <DialogContent style={{ paddingTop: '8px' }}>
        <DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Customer ID"
                variant="outlined"
                fullWidth
                required
                value={orderData.customerId}
                disabled={orderData.orderNo !== undefined}
                onChange={(e) => setOrderData({ ...orderData, customerId: e.target.value })}
              />
              {!customerIdValid && (
                <FormHelperText error>This field is required.</FormHelperText>
              )}
            </Grid>
            
            
            <Grid item xs={6}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="currency">Currency</InputLabel>
                <Select
                  label="Currency"
                  value={orderData.currency}
                  onChange={(e) => setOrderData({ ...orderData, currency: e.target.value })}
                  disabled={orderData.orderNo !== undefined}
                >
                  <MenuItem value="INR">INR</MenuItem>
                  <MenuItem value="$">$</MenuItem>
                </Select>
                {!currencyValid && <FormHelperText error>This field is required.</FormHelperText>}
              </FormControl>
            </Grid>
            

            <Grid item xs={6}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="withCoins">Redeem(?)</InputLabel>
                <Select
                  label="withCoins"
                  value={withCoins}
                  onChange={(e) => setWithCoins(e.target.value)}
                  disabled={orderData.orderNo !== undefined}
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
                {!withCoinsValid && <FormHelperText error>This field is required.</FormHelperText>}
              </FormControl>
            </Grid>
            {orderData.orderNo && (
            <Grid item xs={6}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="orderStatus">Order Status</InputLabel>
                <Select
                  label="Order Status"
                  value={orderData.orderStatus}
                  onChange={(e) => setOrderData({ ...orderData, orderStatus: e.target.value })}
                >
                  <MenuItem value="Created">Created</MenuItem>
                  <MenuItem value="Shipped">Shipped</MenuItem>
                </Select>
                {!orderStatusValid && (
                  <FormHelperText error>This field is required.</FormHelperText>
                )}
              </FormControl>
            </Grid> )}
            <Grid item xs={12}>
              <Button
                variant="outlined"
                color="primary"
                onClick={openItemSelection}
              >
                Add Item
              </Button>
            </Grid>
            <Dialog
              open={itemSelectionOpen}
              onClose={closeItemSelection}
              fullWidth
            >
              <DialogTitle>Select Item and Quantity</DialogTitle>
              <DialogContent className={styles.forms}>
                <FormControl variant="outlined" fullWidth  className={styles.item}>
                  <InputLabel htmlFor="selectedItem">Select Item</InputLabel>
                  <Select
                    label="Select Item"
                    value={selectedItem}
                    onChange={(e) => setSelectedItem(e.target.value)}
                  >
                    {orderItemsMenu.map((item) => (
                      <MenuItem key={item.itemId} value={item}>
                        {item.itemName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Quantity"
                  variant="outlined"
                  fullWidth
                  required
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className={styles.item2}
                  InputProps={{
                    inputProps: {
                      min: 1,
                    },
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={closeItemSelection} color="primary">
                  Cancel
                </Button>
                <Button onClick={addItemWithQuantity} color="primary">
                  Add
                </Button>
              </DialogActions>
            </Dialog>

            {orderItemsD.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1">Selected Items : </Typography>
                <div>
                  {orderItemsD.map((item) => (
                    <Chip
                      key={item.itemId}
                      label={`${item.itemName} x${item.quantity}`}
                      onDelete={() => removeItem(item.itemId)}
                      style={{ margin: '4px' }}
                    />
                  ))}
                </div>
              </Grid>
            )}
          </Grid>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSaveClick} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderModal;