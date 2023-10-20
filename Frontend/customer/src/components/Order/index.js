import React, { useState, useEffect } from "react";
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
  Typography,
  InputAdornment,
  TablePagination,
  IconButton,
  Grid,
} from "@mui/material";
import axios from "axios";
import styles from "./styles.module.css";
import Navbar from "../common/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CustomerDetailsModal from "./CustomerDetailsModal";
import OrderModal from "./OrderModal";
import { ArrowDownward, ArrowUpward, Search } from "@mui/icons-material";
import OrderItemsList from "./OrderItemsList";
import { useLocation } from "react-router-dom";

export const formatDate = (dateString) => {
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

function Order() {
  const location = useLocation();
  const redirectToOrders = location.state
    ? location.state.redirectToOrders
    : false;
  const [orders, setOrders] = useState([]);
  const [searchCustomerId, setSearchCustomerId] = useState("");
  const [deleteOrderId, setDeleteOrderId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderModalData, setOrderModalData] = useState({
    customerId: "",
    currency: "₹",
    orderStatus: "Created",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState("asc");
  const [withCoinsData, setWithCoinsData] = useState("yes");
  const [orderItemsData, setOrderItemsData] = useState([]);
  const [orderItemsMenu, setOrderItemsBcknd] = useState([]);
  const [error, setError] = useState(null);

  const refetchOrders = (headers) => {
    axios
      .get("http://localhost:8080/orders", { headers })
      .then((response) => {
        setOrders(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching order data:", error);
        setError("Error fetching data. Please try again!");
      });
    axios
      .get("http://localhost:8080/items", { headers })
      .then((response) => {
        setOrderItemsBcknd(response.data);
      })
      .catch((error) => {
        console.error("Error fetching order items data:", error);
      });
  };

  useEffect(() => {
    const response = localStorage.getItem("jwt");
    const headers = {
      Authorization: `Bearer ${response}`,
      "Content-Type": "application/json",
    };
    refetchOrders(headers);
    if (redirectToOrders) {
      setIsOrderModalOpen(true);
    }
  }, [redirectToOrders]);

  const handleAddition = () => {
    setOrderModalData({
      customerId: "",
      currency: "₹",
      orderStatus: "Created",
    });

    setWithCoinsData(withCoinsData);
    setOrderItemsData(orderItemsData);
    setIsOrderModalOpen(true);
  };

  const dataToSend = {
    orderModalData,
    withCoinsData,
    orderItemsData,
  };

  const getVisibleOrders = () => {
    let filteredAndSortedOrders = [...orders];

    if (searchCustomerId) {
      filteredAndSortedOrders = filteredAndSortedOrders.filter((order) =>
        order.customerId.includes(searchCustomerId)
      );
    } else {
      filteredAndSortedOrders = filteredAndSortedOrders.sort((a, b) => {
        const dateA = new Date(a.orderDate).getTime();
        const dateB = new Date(b.orderDate).getTime();

        if (sortOrder === "asc") {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      });
    }

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return filteredAndSortedOrders.slice(startIndex, endIndex);
  };

  const handleUpdate = (orderNo) => {
    const selected = orders.find((order) => order.orderNo === orderNo);

    setOrderModalData(selected);

    setIsOrderModalOpen(true);
  };

  const handleView = (orderNo) => {
    const selected = orders.find((order) => order.orderNo === orderNo);
    setSelectedOrder(selected);
    setIsViewModalOpen(true);
  };

  const handleSearch = (e) => {
    setSearchCustomerId(e.target.value);
  };

  const handleDelete = (orderNo) => {
    setDeleteOrderId(orderNo);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirmation = () => {
    const response = localStorage.getItem("jwt");
    const headers = {
      Authorization: `Bearer ${response}`,
      "Content-Type": "application/json",
    };

    axios
      .delete(`http://localhost:8080/orders/${deleteOrderId}`, { headers })
      .then((response) => {
        if (response.status === 200) {
          toast.success("Order has been deleted successfully", {
            position: toast.POSITION.BOTTOM_LEFT,
            autoClose: 900,
          });
          setOrders((prevOrders) =>
            prevOrders.filter((order) => order.orderNo !== deleteOrderId)
          );
        } else {
          toast.error("Order cannot be deleted!", {
            position: toast.POSITION.BOTTOM_LEFT,
            autoClose: 900,
          });
        }
        setIsDeleteModalOpen(false);
      })
      .catch((error) => {
        console.error(
          `Error deleting the order ${deleteOrderId}: ${error.message}`
        );
        toast.error("Order cannot be deleted!", {
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: 900,
        });
        setIsDeleteModalOpen(false);
      });
  };

  const handleDeleteCancel = () => {
    setDeleteOrderId(null);
    setIsDeleteModalOpen(false);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setSelectedOrder(null);
  };

  const handleOrderModalClose = () => {
    setIsOrderModalOpen(false);
    setOrderModalData({
      customerId: "",
      currency: "₹",
      orderStatus: "Created",
    });
    setOrderItemsData([]);
  };

  const handleOrderModalSave = (updatedStatus) => {
    const response = localStorage.getItem("jwt");
    const headers = {
      Authorization: `Bearer ${response}`,
      "Content-Type": "application/json",
    };

    if (orderModalData.orderNo) {
      axios
        .put(
          `http://localhost:8080/orders/${orderModalData.orderNo}`,
          {
            ...orderModalData,
            orderStatus: updatedStatus,
          },
          { headers }
        )
        .then((response) => {
          if (response.status === 200) {
            toast.success("Order has been updated successfully", {
              position: toast.POSITION.BOTTOM_LEFT,
              autoClose: 900,
            });
            setOrders((prevOrders) =>
              prevOrders.map((order) =>
                order.orderNo === orderModalData.orderNo
                  ? orderModalData
                  : order
              )
            );
            refetchOrders(headers);
          } else {
            toast.error("An error occurred while updating the order!", {
              position: toast.POSITION.BOTTOM_LEFT,
              autoClose: 900,
            });
          }
          setIsOrderModalOpen(false);
        })
        .catch((error) => {
          console.error(
            `Error updating the order ${orderModalData.orderNo}: ${error.message}`
          );
          toast.error("Failed to update the order. Please try again!", {
            position: toast.POSITION.BOTTOM_LEFT,
            autoClose: 900,
          });
          setIsOrderModalOpen(false);
        });
    } else {
      axios
        .post("http://localhost:8080/orders", dataToSend, { headers })
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            toast.success("Order has been added successfully", {
              position: toast.POSITION.BOTTOM_LEFT,
              autoClose: 900,
            });
            setOrders((prevOrders) => [...prevOrders, response.data]);
          } else {
            toast.error("An error occurred while adding the order!", {
              position: toast.POSITION.BOTTOM_LEFT,
              autoClose: 900,
            });
          }
          setOrderItemsData([]);
          setIsOrderModalOpen(false);
        })
        .catch((error) => {
          console.error(`Error adding the order: ${error.message}`);
          toast.error("Failed to add the order. Please try again!", {
            position: toast.POSITION.BOTTOM_LEFT,
            autoClose: 900,
          });
          setIsOrderModalOpen(false);
        });
    }
  };

  const filteredOrders = orders.filter(
    (order) => order.customerId && order.customerId.includes(searchCustomerId)
  );

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - filteredOrders.length)
      : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";

    const sorted = [...orders].sort((a, b) => {
      const dateA = new Date(a.orderDate).getTime();
      const dateB = new Date(b.orderDate).getTime();

      if (newSortOrder === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    setSortOrder(newSortOrder);
    setOrders(sorted);
  };

  return (
    <>
      <Navbar />
      <div className={styles.headingContainer}>
        <div className={styles.heading}>
          <b>ORDERS INFORMATION</b>
        </div>
        <div className={styles.actionsContainer}>
          <div className={styles.search}>
            <label className={styles.label}>Search for a Customer : </label>
            <TextField
              label="Search Customer ID"
              size="small"
              variant="outlined"
              value={searchCustomerId}
              onChange={handleSearch}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search />
                  </InputAdornment>
                ),
              }}
              data-testid="searchCustomerId"
            />
          </div>
          <Button
            style={{
              maxWidth: "200px",
              maxHeight: "40px",
              marginTop: "8px",
              marginRight: "10px",
              backgroundColor: "#FF4400",
            }}
            variant="contained"
            className={`${styles.button} ${styles.addOrderButton}`}
            onClick={handleAddition}
            data-testid="add"
            size="small"
          >
            <AddIcon />
          </Button>
        </div>
      </div>
      <TableContainer
        component={Paper}
        className={styles.container}
        data-testid="table"
      >
        <Table>
          <TableHead style={{ backgroundColor: "#CFE2F3" }}>
            <TableRow>
              <TableCell className={styles.rowheader}>
                <b>Order No</b>
              </TableCell>
              <TableCell className={styles.rowheader}>
                <b>Customer ID</b>
              </TableCell>
              <TableCell className={styles.rowheader}>
                <b>Order Date</b>
                <IconButton
                  onClick={handleSort}
                  color="inherit"
                  size="small"
                  aria-label="sort"
                >
                  {sortOrder === "asc" ? <ArrowUpward /> : <ArrowDownward />}
                </IconButton>
              </TableCell>
              <TableCell
                style={{ textAlign: "left" }}
                className={styles.rowheader}
              >
                <b>Total Order Amount</b>
              </TableCell>
              <TableCell className={styles.rowheader}>
                <b>Order Status</b>
              </TableCell>
              <TableCell className={styles.rowheader}>
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getVisibleOrders().map((order) => (
              <TableRow key={order.orderNo} className={styles.tableRow}>
                <TableCell>{order.orderNo}</TableCell>
                <TableCell>
                  <span
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => setSelectedCustomerId(order.customerId)}
                  >
                    {order.customerId}
                  </span>
                </TableCell>
                <TableCell>{formatDate(order.orderDate)}</TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {order.currency} {order.orderTotal}
                </TableCell>
                <TableCell>{order.orderStatus}</TableCell>
                <TableCell>
                  <Button
                    sx={{ mr: 2 }}
                    size="small"
                    variant="contained"
                    color="primary"
                    className={`${styles.button} ${styles.primaryButton}`}
                    onClick={() => handleView(order.orderNo)}
                    data-testid={`viewicon-${order.orderNo}`}
                  >
                    <VisibilityIcon />
                  </Button>
                  <Button
                    sx={{ mr: 2 }}
                    size="small"
                    variant="contained"
                    color="success"
                    className={`${styles.button} ${styles.secondaryButton}`}
                    onClick={() => handleUpdate(order.orderNo)}
                    data-testid={`editicon-${order.orderNo}`}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    className={`${styles.button} ${styles.tertiaryButton}`}
                    onClick={() => handleDelete(order.orderNo)}
                    data-testid={`deleteicon-${order.orderNo}`}
                  >
                    <DeleteIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={5} />
              </TableRow>
            )}
          </TableBody>
        </Table>
        {error && (
          <h4 style={{ display: "flex", justifyContent: "center" }}>{error}</h4>
        )}
      </TableContainer>
      <Dialog open={isDeleteModalOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {" "}
            Are you sure you want to delete this order?{" "}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteCancel}
            color="primary"
            data-testid="cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirmation}
            color="error"
            data-testid="deletebutton"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isViewModalOpen} onClose={handleViewModalClose}>
        <DialogTitle variant="body1">
          <b style={{ fontSize: "18px" }}>ORDER DETAILS</b>
        </DialogTitle>
        {selectedOrder && (
          <>
            <DialogContent>
              <DialogContentText>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <div>
                      <Typography variant="body1">
                        <b>Order No : </b> {selectedOrder.orderNo}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="body1">
                        <b>Customer ID : </b> {selectedOrder.customerId}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="body1">
                        <b>Total No of Items : </b> {selectedOrder.totalItems}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="body1">
                        <b>Total Order Amount : </b> {selectedOrder.currency}{" "}
                        {selectedOrder.orderTotal}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div>
                      <Typography variant="body1">
                        <b>Order Status : </b> {selectedOrder.orderStatus}
                      </Typography>
                    </div>
                    <div>
                      <Typography
                        variant="body1"
                        style={{ whiteSpace: "nowrap", paddingRight: "20px" }}
                      >
                        <b>Ordered Date: </b>
                        {formatDate(selectedOrder.orderDate)}
                      </Typography>
                    </div>
                    <div>
                      <Typography
                        variant="body1"
                        style={{ whiteSpace: "nowrap", paddingRight: "20px" }}
                      >
                        <b>Last Modified: </b>
                        {formatDate(selectedOrder.lastModifiedTS)}
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              </DialogContentText>
              {selectedOrder.orderItems &&
                selectedOrder.orderItems.length > 0 && (
                  <>
                    <OrderItemsList orderItems={selectedOrder.orderItems} />
                  </>
                )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleViewModalClose}
                color="primary"
                data-testid="close"
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      <OrderModal
        isOpen={isOrderModalOpen}
        handleClose={handleOrderModalClose}
        orderData={orderModalData}
        withCoins={withCoinsData}
        setWithCoins={setWithCoinsData}
        orderItemsMenu={orderItemsMenu}
        orderItemsD={orderItemsData}
        setOrderItemsD={setOrderItemsData}
        setOrderData={setOrderModalData}
        handleSave={handleOrderModalSave}
      />
      <CustomerDetailsModal
        customerId={selectedCustomerId}
        isOpen={Boolean(selectedCustomerId)}
        handleClose={() => setSelectedCustomerId(null)}
      />
      <ToastContainer />
      <TablePagination
        rowsPerPageOptions={[
          5,
          10,
          25,
          50,
          { label: "All", value: filteredOrders.length },
        ]}
        component="div"
        count={filteredOrders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}

export default Order;
