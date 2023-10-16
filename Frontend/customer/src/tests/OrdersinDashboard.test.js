import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Orders from "../components/Customer/Dashboard/Orders";

describe("Orders Component", () => {
  const orders = [
    {
      orderKey: 1,
      orderNo: "12345",
      orderDate: "2023-09-30T10:00:00Z",
      reward: {
        rewardsEarned: 50,
        rewardsRedeemed: 20,
      },
      totalItems: 3,
      currency: "USD",
      orderTotal: 100,
      orderStatus: "Completed",
    },
    {
      orderKey: 2,
      orderNo: "54321",
      orderDate: "2023-09-29T15:30:00Z",
      reward: {
        rewardsEarned: 30,
        rewardsRedeemed: 10,
      },
      totalItems: 2,
      currency: "EUR",
      orderTotal: 80,
      orderStatus: "Pending",
    },
  ];

  it("renders the component with order data", () => {
    render(<Orders orders={orders} />);

    expect(screen.getByText("Order No")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Rewards Earned")).toBeInTheDocument();
    expect(screen.getByText("Rewards Redeemed")).toBeInTheDocument();
    expect(screen.getByText("Total Items")).toBeInTheDocument();
    expect(screen.getByText("Total Order Value")).toBeInTheDocument();
    expect(screen.getByText("Order Status")).toBeInTheDocument();

    expect(screen.getByText("12345")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("USD 100")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();

    expect(screen.getByLabelText("sort")).toBeInTheDocument();
  }, 10000);

  it("handles sorting of orders by date", () => {
    render(<Orders orders={orders} />);

    expect(screen.getByText("12345")).toBeInTheDocument();
    expect(screen.getByText("54321")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("sort"));

    expect(screen.getByText("54321")).toBeInTheDocument();
    expect(screen.getByText("12345")).toBeInTheDocument();
  }, 10000);

  it("displays a message when there are no orders", () => {
    render(<Orders orders={[]} />);
    expect(
      screen.getByText("No orders have been placed by the customer!")
    ).toBeInTheDocument();
  });
}, 10000);
