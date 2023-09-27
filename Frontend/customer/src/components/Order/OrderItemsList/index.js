import { Typography } from "@mui/material";
import React from "react";

function OrderItemsList({ orderItems }) {
  const listItemStyle = {
    margin: "8px 0",
    padding: "4px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  return (
    <div style={{ marginTop: "8px" }}>
      <Typography variant="p"><b>Ordered Items and quantities : </b></Typography>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {orderItems.map((item) => (
          <li key={item.itemId} style={listItemStyle}>
            <span>{item.itemName}</span>
            <span>Quantity: {item.quantity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrderItemsList;