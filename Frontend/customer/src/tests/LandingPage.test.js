import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import LandingPage from "../components/LandingPage";
import { useNavigate } from "react-router-dom";


jest.mock("axios");


jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: jest.fn(),
  };
});

describe("LandingPage Component", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: [10, 20, 30],
    });
  });

  it("renders the landing page with customer counts", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Customers Onboarded")).toBeInTheDocument();
    expect(await screen.findByText("Orders Placed")).toBeInTheDocument();
    expect(await screen.findByText("Rewards Issued")).toBeInTheDocument();
    expect(await screen.findByText("10")).toBeInTheDocument();
    expect(await screen.findByText("20")).toBeInTheDocument();
    expect(await screen.findByText("30")).toBeInTheDocument();
  });

  it("navigates to the Customers page when the Customer card is clicked", () => {
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);
  
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </MemoryRouter>
    );
  
    const customerCard = screen.getByText("Customer");
    userEvent.click(customerCard);
  });
  

  it("navigates to the Orders page when the Order card is clicked", () => {
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </MemoryRouter>
    );

    const orderCard = screen.getByText("Order");
    userEvent.click(orderCard);
  });

  it("navigates to the Rewards page when the Rewards card is clicked", () => {
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </MemoryRouter>
    );

    const rewardsCard = screen.getByText("Rewards");
    userEvent.click(rewardsCard);
  });

  it("renders status counts section with correct counts", async () => {
    axios.get.mockResolvedValue({
      data: {
        Created: 5,
        "Items Packed": 10,
        Shipped: 15,
        "In Transit": 20,
        Delivered: 25,
      },
    });
  
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByText("Created")).toBeInTheDocument();
  expect(await screen.findByText("Items Packed")).toBeInTheDocument();
  expect(await screen.findByText("Shipped")).toBeInTheDocument();
  expect(await screen.findByText("In Transit")).toBeInTheDocument();
  expect(await screen.findByText("Delivered")).toBeInTheDocument();

  expect(await screen.findByText("5")).toBeInTheDocument();
  expect(await screen.findByText("10")).toBeInTheDocument();
  expect(await screen.findByText("15")).toBeInTheDocument();
  expect(await screen.findByText("20")).toBeInTheDocument();
  expect(await screen.findByText("25")).toBeInTheDocument();
});

  
});
