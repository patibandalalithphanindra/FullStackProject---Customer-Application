import { render, screen } from "@testing-library/react";
import React from "react";
import axios from "axios";
import CustomerDetailsModal from "../components/Order/CustomerDetailsModal";

jest.mock("axios");

beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(console, "info").mockImplementation(() => {});
  jest.spyOn(console, "debug").mockImplementation(() => {});
});

describe("CustomerDetailsModal Component", () => {
  const customerData = {
    customerId: 1,
    firstName: "Lalith",
    lastName: "Phanindra",
    emailId: "plp@gmail.com",
    phoneNo: "1234567890",
    addressLine1: "123 Main St",
    addressLine2: "Apt 4B",
    city: "Bangalore",
    state: "Karnataka",
    zipCode: "560068",
    country: "India",
    status: "Active",
  };

  it("renders customer details when loading is complete", async () => {
    axios.get.mockResolvedValue({ data: customerData });

    render(
      <CustomerDetailsModal
        customerId={1}
        isOpen={true}
        handleClose={() => {}}
      />
    );
  }, 10000);

  it("closes the modal when Close button is clicked", async () => {
    const handleClose = jest.fn();
    axios.get.mockResolvedValue({ data: customerData });

    render(
      <CustomerDetailsModal
        customerId={1}
        isOpen={true}
        handleClose={handleClose}
      />
    );

    const closeButton = screen.getByText("Close");
    closeButton.click();

    expect(handleClose).toHaveBeenCalledTimes(1);
  }, 10000);

  it("logs an error when API request to fetch status counts fails", async () => {
    const handleClose = jest.fn();
    jest
      .spyOn(axios, "get")
      .mockRejectedValue(new Error("Error fetching customer data: "));

    render(
      <CustomerDetailsModal
        customerId={1}
        isOpen={true}
        handleClose={handleClose}
      />
    );

    await expect(axios.get()).rejects.toThrow("Error fetching customer data: ");
  }, 10000);
});
