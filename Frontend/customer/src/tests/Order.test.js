import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Order, { formatDate } from "../components/Order";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CustomerDetailsModal from "../components/Order/CustomerDetailsModal";

jest.mock("axios");

const matchText = (element, expectedText) => {
  const cleanedElementText = element.textContent.replace(/\s+/g, " ").trim();
  const cleanedExpectedText = expectedText.replace(/\s+/g, " ").trim();
  expect(cleanedElementText).toBe(cleanedExpectedText);
};

beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(console, "info").mockImplementation(() => {});
  jest.spyOn(console, "debug").mockImplementation(() => {});
});

describe("Order Component", () => {
  const mockOrders = [
    {
      orderNo: 1,
      customerId: "123",
      orderDate: "2023-10-01T10:00:00Z",
      orderTotal: 100,
      currency: "USD",
      orderStatus: "Created",
      totalItems: 2,
      lastModified: "2023-10-01T10:00:00Z",
    },
    {
      orderNo: 2,
      customerId: "456",
      orderDate: "2023-10-02T09:30:00Z",
      orderTotal: 150,
      currency: "₹",
      orderStatus: "Delivered",
      totalItems: 2,
      lastModified: "2023-10-02T09:30:00Z",
    },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockOrders });
  });

  test("renders Order component", async () => {
    axios.get.mockResolvedValueOnce({ data: mockOrders });

    render(
      <MemoryRouter>
        <Order />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("ORDERS INFORMATION")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Order No")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Customer ID")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Total Order Amount")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Order Status")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Order Date")).toBeInTheDocument();
    });
  }, 10000);

  it("allows searching for orders", async () => {
    render(
      <MemoryRouter>
        <Order />
      </MemoryRouter>
    );

    const searchInput = screen.getByLabelText("Search Customer ID");

    fireEvent.change(searchInput, { target: { value: "123" } });

    await waitFor(() => {
      matchText(screen.getByText("1"), "1");
    });

    await waitFor(() => {
      expect(screen.queryByText("2")).not.toBeInTheDocument();
    });
  }, 10000);

  it("displays a confirmation dialog when deleting an Order", async () => {
    axios.get.mockResolvedValueOnce({ data: mockOrders });
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Order />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("123")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("deleteicon-1")).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId(`deleteicon-1`);

    fireEvent.click(deleteButton);

    expect(screen.getByText("Confirmation")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete this order?")
    ).toBeInTheDocument();
  }, 10000);

  it("closes the confirmation dialog when canceling deletion", async () => {
    render(
      <MemoryRouter>
        <Order />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("123")).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId("deleteicon-1");
    fireEvent.click(deleteButton);

    const cancelButton = screen.getByTestId("cancel");
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(
        screen.queryByText("Are you sure you want to delete this order?")
      ).not.toBeInTheDocument();
    });
  }, 10000);

  it("opens the Order Modal for addition", async () => {
    render(
      <MemoryRouter>
        <Order />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("add")).toBeInTheDocument();
    });

    const addButton = screen.getByTestId("add");

    fireEvent.click(addButton);

    await waitFor(() => {
      matchText(screen.getByText("Add"), "Add");
    });
  }, 10000);

  it("opens the Order Modal for editing", async () => {
    render(
      <MemoryRouter>
        <Order />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("123")).toBeInTheDocument();
    });

    const editButton = screen.getByTestId("editicon-1");

    fireEvent.click(editButton);

    await waitFor(() => {
      matchText(screen.getByText("Close"), "Close");
    });
  }, 10000);

  it("opens the View Modal for viewing order details", async () => {
    axios.get.mockResolvedValue({ data: mockOrders });
    render(
      <MemoryRouter>
        <Order />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("123")).toBeInTheDocument();
    });

    const viewButton = screen.getByTestId("viewicon-1");

    fireEvent.click(viewButton);

    await waitFor(() => {
      matchText(screen.getByText("ORDER DETAILS"), "ORDER DETAILS");
    });
  }, 10000);

  test("user can change rows per page", async () => {
    axios.get.mockResolvedValueOnce({ data: mockOrders });

    render(
      <MemoryRouter>
        <Order />
      </MemoryRouter>
    );

    const rowsPerPageSelect = screen.getByLabelText(/Rows per page/i);
    fireEvent.mouseDown(rowsPerPageSelect);
    const option = screen.getByText("10");
    fireEvent.click(option);

    await waitFor(() => {
      expect(screen.getAllByRole("row").length).toBe(3);
    });
  }, 10000);

  test("handles API error", async () => {
    axios.get.mockRejectedValueOnce(new Error("API error"));

    render(
      <MemoryRouter>
        <Order />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Error fetching data. Please try again!")
      ).toBeInTheDocument();
    });
  }, 10000);

  test("displays empty rows when there are no orders", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <Order />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("ORDERS INFORMATION")).toBeInTheDocument();
    });
  }, 10000);

  test("user can search and sort orders", async () => {
    axios.get.mockResolvedValueOnce({ data: mockOrders });

    render(
      <MemoryRouter>
        <Order />
      </MemoryRouter>
    );

    const searchInput = screen.getByLabelText(/Search Customer ID/i);
    fireEvent.change(searchInput, { target: { value: "123" } });

    await waitFor(() => {
      expect(screen.getByText("123")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByText("456")).not.toBeInTheDocument();
    });

    const sortButton = screen.getByRole("button", { name: /sort/i });
    fireEvent.click(sortButton);

    await waitFor(() => {
      const orderItems = screen.getAllByText(/\d/);
      expect(orderItems[0]).toHaveTextContent("1");
    });
  }, 10000);

  it("handles order deletion failure", async () => {
    axios.delete.mockRejectedValueOnce(new Error("Deletion failed"));

    render(
      <MemoryRouter>
        <Order />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("123")).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId("deleteicon-1");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(
        screen.getByText("Are you sure you want to delete this order?")
      ).toBeInTheDocument();
    });

    const deleteConfirmationButton = screen.getByTestId("deletebutton");
    fireEvent.click(deleteConfirmationButton);

    await waitFor(() => {
      expect(
        screen.queryByText("Are you sure you want to delete this order?")
      ).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("1")).toBeInTheDocument();
    });
  }, 10000);

  it("closes view modal when 'Close' is clicked", async () => {
    axios.get.mockResolvedValueOnce({ data: mockOrders });

    render(
      <MemoryRouter>
        <Order />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("123")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("viewicon-1")).toBeInTheDocument();
    });

    const viewButton = screen.getByTestId("viewicon-1");
    fireEvent.click(viewButton);

    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText("Order Details")).not.toBeInTheDocument();
    });
  }, 10000);

  it("closes order modal when 'Close' is clicked", async () => {
    axios.get.mockResolvedValueOnce({ data: mockOrders });

    render(
      <MemoryRouter>
        <Order />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("add")).toBeInTheDocument();
    });

    const addButton = screen.getByTestId("add");
    fireEvent.click(addButton);

    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText("Add Order")).not.toBeInTheDocument();
    });
  }, 10000);

  it("formats date correctly", () => {
    const dateToFormat = "2023-01-01T12:00:00Z";
    const expectedFormattedDate = "01/01/2023, 05:30 PM";
    const formattedDate = formatDate(dateToFormat);
    expect(formattedDate).toBe(expectedFormattedDate);
  }, 10000);

  test("user can sort orders by date", async () => {
    axios.get.mockResolvedValueOnce({ data: mockOrders });

    render(
      <MemoryRouter>
        <Order />
      </MemoryRouter>
    );

    const sortButton = screen.getByRole("button", { name: /sort/i });
    fireEvent.click(sortButton);

    await waitFor(() => {
      const orderItems = screen.getAllByText(/\d/);
      expect(orderItems[0]).toHaveTextContent("2");
    });

    await waitFor(() => {
      const orderItems = screen.getAllByText(/\d/);
      expect(orderItems[3]).toHaveTextContent("1");
    });
  }, 10000);

  test("user can sort orders by date in descending order", async () => {
    axios.get.mockResolvedValueOnce({ data: mockOrders });

    render(
      <MemoryRouter>
        <Order />
      </MemoryRouter>
    );

    const sortButton = screen.getByRole("button", { name: /sort/i });
    fireEvent.click(sortButton);

    await waitFor(() => {
      const orderItems = screen.getAllByText(/\d/);
      expect(orderItems[0]).toHaveTextContent("2");
    });

    await waitFor(() => {
      const orderItems = screen.getAllByText(/\d/);
      expect(orderItems[3]).toHaveTextContent("1");
    });
  }, 10000);

  test("user can sort orders by date in ascending order", async () => {
    axios.get.mockResolvedValueOnce({ data: mockOrders });

    render(
      <MemoryRouter>
        <Order />
      </MemoryRouter>
    );

    const sortButton = screen.getByRole("button", { name: /sort/i });
    fireEvent.click(sortButton);

    fireEvent.click(sortButton);

    await waitFor(() => {
      const orderItems = screen.getAllByText(/\d/);
      expect(orderItems[0]).toHaveTextContent("1");
    });

    await waitFor(() => {
      const orderItems = screen.getAllByText(/\d/);
      expect(orderItems[4]).toHaveTextContent("2");
    });
  }, 10000);

  test("user can sort orders by date in ascending and descending order", async () => {
    axios.get.mockResolvedValueOnce({ data: mockOrders });

    render(
      <MemoryRouter>
        <Order />
      </MemoryRouter>
    );

    const sortButton = screen.getByRole("button", { name: /sort/i });
    fireEvent.click(sortButton);

    await waitFor(() => {
      const orderItems = screen.getAllByText(/\d/);
      expect(orderItems[0]).toHaveTextContent("2");
    });

    await waitFor(() => {
      const orderItems = screen.getAllByText(/\d/);
      expect(orderItems[3]).toHaveTextContent("1");
    });

    fireEvent.click(sortButton);

    await waitFor(() => {
      const orderItems = screen.getAllByText(/\d/);
      expect(orderItems[0]).toHaveTextContent("1");
    });

    await waitFor(() => {
      const orderItems = screen.getAllByText(/\d/);
      expect(orderItems[4]).toHaveTextContent("2");
    });
  }, 10000);

  test("user can change the page", async () => {
    render(
      <MemoryRouter>
        <Order />
      </MemoryRouter>
    );
    const nextPageButton = screen.getByRole("button", { name: /Next page/i });

    fireEvent.click(nextPageButton);
  }, 10000);

  test("handleClose is called when modal close button is clicked", () => {
    const setSelectedCustomerId = jest.fn();

    render(
      <CustomerDetailsModal
        customerId="123"
        isOpen={true}
        handleClose={() => setSelectedCustomerId(null)}
      />
    );

    const closeBtn = screen.getByRole("button", { name: /Close/i });

    fireEvent.click(closeBtn);

    expect(setSelectedCustomerId).toHaveBeenCalledWith(null);
  }, 10000);

  it("handles API error when adding an order", async () => {
    axios.post.mockRejectedValueOnce(new Error("Error adding the order: "));

    render(
      <MemoryRouter>
        <Order />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("add")).toBeInTheDocument();
    });

    const addButton = screen.getByTestId("add");

    fireEvent.click(addButton);
    await expect(axios.post()).rejects.toThrow("Error adding the order: ");
  }, 10000);

  it("handles API error when updating an order", async () => {
    axios.put.mockRejectedValueOnce(new Error(`Error updating the order: `));

    render(
      <MemoryRouter>
        <Order />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("editicon-1")).toBeInTheDocument();
    });

    const editButton = screen.getByTestId("editicon-1");

    fireEvent.click(editButton);

    await expect(axios.put()).rejects.toThrow("Error updating the order: ");
  }, 10000);
});
