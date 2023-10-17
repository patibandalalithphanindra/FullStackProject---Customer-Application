import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import React from "react";

function OrderItemsList({ orderItems }) {
  const containerStyle = {
    maxHeight: "250px",
    overflowY: "auto",
    marginTop: "12px",
  };

  return (
    <div style={{ marginTop: "8px" }}>
      <Typography variant="body1">
        <b>Ordered Items Information : </b>
      </Typography>
      <TableContainer component={Paper} style={containerStyle}>
        <Table>
          <TableHead style={{ backgroundColor: "#D2E1F2" }}>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>Item Name</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>
                Item Price
              </TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>
                Quantity
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderItems.map((item) => (
              <TableRow key={item.itemId} data-testid="order-item">
                <TableCell>{item.itemName}</TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  ₹ {item.itemPrice}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {item.quantity}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default OrderItemsList;
