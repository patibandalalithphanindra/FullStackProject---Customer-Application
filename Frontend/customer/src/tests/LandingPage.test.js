import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import LandingPage from "../components/LandingPage";

jest.mock("axios");

  it("renders the landing page with customer counts", async () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Customers Onboarded")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Total Orders Placed")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("No of Rewards Earned")).toBeInTheDocument();
    });
  });

  it("navigates to the Customers page when the Customer card is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <LandingPage />
      </MemoryRouter>
    );

    const customerCard = screen.getByText("Customer");
    userEvent.click(customerCard);

    await waitFor(() => {
      expect(screen.getByText("CUSTOMERS INFORMATION")).toBeInTheDocument();
    });
  });

  it("navigates to the Orders page when the Order card is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <LandingPage />
      </MemoryRouter>
    );

    const orderCard = screen.getByText("Order");
    userEvent.click(orderCard);

    await waitFor(() => {
      expect(screen.getByText("ORDERS INFORMATION")).toBeInTheDocument();
    });
  });

  it("navigates to the Rewards page when the Rewards card is clicked", async () => {
    render(
        <MemoryRouter initialEntries={["/"]}>
        <LandingPage />
      </MemoryRouter>
    );

    const rewardsCard = screen.getByText("Rewards");
    userEvent.click(rewardsCard);

    await waitFor(() => {
      expect(screen.getByText("REWARDS INFORMATION")).toBeInTheDocument();
    });
  });
});
