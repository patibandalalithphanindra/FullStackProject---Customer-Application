import React from "react";
import { render, screen } from "@testing-library/react";
import OrderItemsList from "../components/Order/OrderItemsList";

describe("OrderItemsList Component", () => {
  const orderItems = [
    { itemId: 1, itemName: "Item 1", quantity: 2 },
    { itemId: 2, itemName: "Item 2", quantity: 3 },
  ];

  it("renders with order items", () => {
    render(<OrderItemsList orderItems={orderItems} />);

    const titleElement = screen.getByText("Ordered Items Information :");
    expect(titleElement).toBeInTheDocument();

    orderItems.forEach((item) => {
      const itemNameElement = screen.getByText(item.itemName);
      const quantityElement = screen.getByText(item.quantity);
      expect(itemNameElement).toBeInTheDocument();
      expect(quantityElement).toBeInTheDocument();
    });

    const listItemElements = screen.getAllByTestId("order-item");
    expect(listItemElements.length).toBe(orderItems.length);
  });
});
