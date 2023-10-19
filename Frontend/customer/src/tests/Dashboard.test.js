import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../components/Customer/Dashboard";
import axios from "axios";

jest.mock("axios");
jest.spyOn(console, "error");

beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(console, "info").mockImplementation(() => {});
  jest.spyOn(console, "debug").mockImplementation(() => {});
});

describe("Dashboard Component", () => {
  beforeEach(() => {
    axios.get.mockReset();
  });

  it("logs errors when fetching data", async () => {
    axios.get.mockRejectedValueOnce(new Error("Test error"));

    render(
      <MemoryRouter initialEntries={["/dashboard/1"]}>
        <Routes>
          <Route path="/dashboard/:customerId" element={<Dashboard />} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByText("CUSTOMER DASHBOARD");

    expect(console.error).toHaveBeenCalledWith(
      "Error fetching customer data:",
      expect.any(Error)
    );
    expect(console.error).toHaveBeenCalledWith(
      "Error fetching reward details:",
      expect.any(Error)
    );
    expect(console.error).toHaveBeenCalledWith(
      "Error fetching orders data:",
      expect.any(Error)
    );
  }, 10000);

  it("navigates back when the ArrowBack button is clicked", async () => {
    const mockData = {
      customer: {
        firstName: "Lalith",
        lastName: "Phanindra",
        emailId: "plp@gmail.com",
        phoneNo: "1234567890",
      },
      orders: [
        {
          orderNo: "123",
          orderDate: "2023-01-15T12:00:00Z",
          rewardsEarned: 10,
          rewardsRedeemed: 5,
          totalItems: 3,
          currency: "USD",
          orderTotal: 100,
          orderStatus: "Delivered",
        },
      ],
      rewards: {
        rewardsEarned: 50,
        rewardsRedeemed: 20,
        rewardsBalance: 30,
      },
    };

    axios.get
      .mockResolvedValueOnce({ data: mockData.customer })
      .mockResolvedValueOnce({ data: mockData.orders })
      .mockResolvedValueOnce({ data: mockData.rewards });

    render(
      <MemoryRouter initialEntries={["/dashboard/1"]}>
        <Routes>
          <Route path="/dashboard/:customerId" element={<Dashboard />} />
        </Routes>
      </MemoryRouter>
    );

    const arrowBackButton = screen.getByTestId("arrow-back");
    fireEvent.click(arrowBackButton);
  }, 10000);
});
