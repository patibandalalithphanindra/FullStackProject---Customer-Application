import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

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
  const [itemDetailsValid, setItemDetailsValid] = useState(true);
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  const orderStatusStages = useMemo(
    () => ["Created", "Packed", "Shipped", "In Transit", "Delivered"],
    []
  );

  const resetState = () => {
    setCustomerIdValid(true);
    setCurrencyValid(true);
    setWithCoinsValid(true);
    setSelectedItem("");
    setQuantity("");
    setQuantityError("");
    setItemDetailsValid(true);
  };

  useEffect(() => {
    if (isOpen) {
      resetState();
      if (orderData.orderNo) {
        setActiveStep(orderStatusStages.indexOf(orderData.orderStatus));
      } else {
        setActiveStep(0);
      }
    }
  }, [isOpen, orderData, orderStatusStages]);

  const getNextStatus = () => {
    const currentStatusIndex = orderStatusStages.indexOf(orderData.orderStatus);
    if (currentStatusIndex < orderStatusStages.length - 1) {
      return orderStatusStages[currentStatusIndex + 1];
    } else {
      return orderData.orderStatus;
    }
  };

  const getNextStatusText = () => {
    const nextStatus = getNextStatus();
    switch (nextStatus) {
      case "Packed":
        return "Pack";
      case "Shipped":
        return "Ship";
      case "In Transit":
        return "Transit";
      case "Delivered":
        return "Deliver";
      default:
        return "Update";
    }
  };

  const addItemWithQuantity = () => {
    if (selectedItem && quantity > 0) {
      setItemDetailsValid(true);

      const existingItemIndex = orderItemsD.findIndex(
        (item) => item.itemId === selectedItem.itemId
      );

      if (existingItemIndex !== -1) {
        const updatedOrderItems = [...orderItemsD];
        updatedOrderItems[existingItemIndex].quantity += Number(quantity);
        setOrderItemsD(updatedOrderItems);
      } else {
        const newItem = {
          itemId: selectedItem.itemId,
          itemName: selectedItem.itemName,
          itemPrice: selectedItem.itemPrice,
          quantity: Number(quantity),
        };
        setOrderItemsD([...orderItemsD, newItem]);
      }

      setSelectedItem("");
      setQuantity("");
      setQuantityError("");
    } else {
      if (!selectedItem) {
        setItemDetailsValid(false);
      }
      if (!quantity) {
        setQuantityError("Enter quantity");
      } else if (quantity <= 0) {
        setQuantityError("Should be greater than zero");
      } else {
        setQuantityError("");
      }
    }
  };

  const removeItem = (itemId) => {
    const updatedItems = orderItemsD.filter((item) => item.itemId !== itemId);
    setOrderItemsD(updatedItems);
  };

  const handleSaveClick = async (orderNoExists) => {
    const isCustomerIdValid = !!orderData.customerId;
    const isWithCoinsValid = !!withCoins;
    const isOrderItemsValid = !!orderItemsD && orderItemsD.length > 0;
    const isQuantityValid = !!quantity && quantity > 0;
    if (!isOrderItemsValid || !isQuantityValid) {
      setItemDetailsValid(false);
    }
    setCustomerIdValid(isCustomerIdValid);
    setWithCoinsValid(isWithCoinsValid);

    if (!orderNoExists) {
      if (isCustomerIdValid && isWithCoinsValid && isOrderItemsValid) {
        setItemDetailsValid(true);
        await handleSave();
        setActiveStep((prevStep) => prevStep + 1);
      }
    } else {
      const updatedStatusIndex = activeStep + 1;
      if (updatedStatusIndex < orderStatusStages.length) {
        const updatedStatus = orderStatusStages[updatedStatusIndex];
        setOrderData({ ...orderData, orderStatus: updatedStatus });
        await handleSave(updatedStatus);
        setActiveStep(updatedStatusIndex);
      }
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>
        {orderData.orderNo ? "Edit an existing Order" : "Add a new Order"}
      </DialogTitle>
      <DialogContent style={{ paddingTop: "8px" }}>
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
                onChange={(e) =>
                  setOrderData({ ...orderData, customerId: e.target.value })
                }
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
                  aria-label="Currency"
                  onChange={(e) =>
                    setOrderData({ ...orderData, currency: e.target.value })
                  }
                  disabled={orderData.orderNo !== undefined}
                >
                  <MenuItem value="₹">₹</MenuItem>
                </Select>
                {!currencyValid && (
                  <FormHelperText error>This field is required.</FormHelperText>
                )}
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
                {!withCoinsValid && (
                  <FormHelperText error>This field is required.</FormHelperText>
                )}
              </FormControl>
            </Grid>
            {!orderData.orderNo && (
              <Grid item xs={12}>
                <Typography variant="p"> Select Items </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      style={{ marginTop: "10px" }}
                    >
                      <InputLabel id="select-item-label" htmlFor="select-item">
                        Select Item
                      </InputLabel>
                      <Select
                        labelId="select-item-label"
                        label="Select Items"
                        value={selectedItem}
                        onChange={(e) => setSelectedItem(e.target.value)}
                        data-testid="selectlabel"
                      >
                        {orderItemsMenu.map((item) => (
                          <MenuItem key={item.itemId} value={item}>
                            {`${item.itemName} - ₹ ${item.itemPrice}`}
                          </MenuItem>
                        ))}
                      </Select>
                      {!itemDetailsValid && (
                        <FormHelperText error>
                          Please select an item
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="Quantity"
                      variant="outlined"
                      fullWidth
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      error={!!quantityError}
                      style={{ marginTop: "10px" }}
                    />
                    {quantityError && (
                      <FormHelperText error>{quantityError}</FormHelperText>
                    )}
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Button
                      aria-label="Add"
                      color="success"
                      variant="contained"
                      onClick={addItemWithQuantity}
                      style={{ marginTop: "10px" }}
                    >
                      <AddIcon />
                    </Button>
                  </Grid>
                </Grid>
                {orderItemsD.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Item Name</TableCell>
                          <TableCell>Item Price</TableCell>
                          <TableCell>Item Quantity</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderItemsD.map((item) => (
                          <TableRow key={item.itemId}>
                            <TableCell>{item.itemName}</TableCell>
                            <TableCell>₹ {item.itemPrice}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>
                              <IconButton
                                aria-label="Delete"
                                onClick={() => removeItem(item.itemId)}
                                data-testid={`delete-${item.itemId}`}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : null}
              </Grid>
            )}
          </Grid>
        </DialogContentText>
      </DialogContent>
      {orderData.orderNo && (
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          style={{ marginTop: "16px" }}
        >
          {orderStatusStages.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}
      <DialogActions style={{ marginTop: "16px" }}>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
        {activeStep < orderStatusStages.length - 1 ? (
          <Button
            onClick={() => handleSaveClick(!!orderData.orderNo)}
            color="primary"
            variant="contained"
          >
            {orderData.orderNo ? getNextStatusText() : "Add"}
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  );
};

export default OrderModal;
