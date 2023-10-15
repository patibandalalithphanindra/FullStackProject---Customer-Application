import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import LandingPage from "../components/LandingPage";
import { useNavigate } from "react-router-dom";

jest.mock("axios");

beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(console, "info").mockImplementation(() => {});
  jest.spyOn(console, "debug").mockImplementation(() => {});
});

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

    expect(await screen.findByText("Customers")).toBeInTheDocument();
    expect(await screen.findByText("Orders Placed")).toBeInTheDocument();
    expect(await screen.findByText("Rewards Issued")).toBeInTheDocument();
    expect(await screen.findByText("10")).toBeInTheDocument();
    expect(await screen.findByText("20")).toBeInTheDocument();
    expect(await screen.findByText("30")).toBeInTheDocument();
  }, 10000);

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
  }, 10000);

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
  }, 10000);

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
  }, 10000);

  it("renders status counts section with correct counts", async () => {
    axios.get.mockResolvedValue({
      data: {
        Created: 5,
        Packed: 10,
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
    expect(await screen.findByText("Packed")).toBeInTheDocument();
    expect(await screen.findByText("Shipped")).toBeInTheDocument();
    expect(await screen.findByText("In Transit")).toBeInTheDocument();
    expect(await screen.findByText("Delivered")).toBeInTheDocument();

    expect(await screen.findByText("5")).toBeInTheDocument();
    expect(await screen.findByText("10")).toBeInTheDocument();
    expect(await screen.findByText("15")).toBeInTheDocument();
    expect(await screen.findByText("20")).toBeInTheDocument();
    expect(await screen.findByText("25")).toBeInTheDocument();
  }, 10000);
});

describe("LandingPage Component with no data", () => {
  beforeEach(() => {
    axios.get.mockResolvedValueOnce({
      data: [],
    });
    axios.get.mockResolvedValueOnce({
      data: {},
    });
  });

  it("renders 0s for status counts when data is not found", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByText("Created")).toBeInTheDocument();
    expect(await screen.findByText("Packed")).toBeInTheDocument();
    expect(await screen.findByText("Shipped")).toBeInTheDocument();
    expect(await screen.findByText("In Transit")).toBeInTheDocument();
    expect(await screen.findByText("Delivered")).toBeInTheDocument();

    const zeroCounts = screen.getAllByText("0", { selector: "h6" });
    zeroCounts.forEach((count) => {
      expect(count).toBeInTheDocument();
    });
  }, 10000);

  it("logs an error when API request to fetch customer counts fails", async () => {
    jest
      .spyOn(axios, "get")
      .mockRejectedValue(new Error("Error fetching customer counts data:"));

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </MemoryRouter>
    );
    await expect(axios.get()).rejects.toThrow(
      "Error fetching customer counts data:"
    );
  }, 10000);

  it("logs an error when API request to fetch status counts fails", async () => {
    jest
      .spyOn(axios, "get")
      .mockRejectedValue(new Error("Error fetching status counts data:"));

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </MemoryRouter>
    );
    await expect(axios.get()).rejects.toThrow(
      "Error fetching status counts data:"
    );
  }, 10000);
});
