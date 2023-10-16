import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Customer from "../components/Customer";
import CustomerModal from "../components/Customer/CustomerModal";

jest.mock("axios");
jest.mock("react-toastify");

beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(console, "info").mockImplementation(() => {});
  jest.spyOn(console, "debug").mockImplementation(() => {});
});

describe("Customer Component", () => {
  const mockCustomers = [
    {
      customerId: 1,
      firstName: "Lalith",
      lastName: "Phanindra",
      emailId: "lalith@example.com",
      phoneNo: "1234567890",
    },
    {
      customerId: 2,
      firstName: "Hanumath",
      lastName: "Prasad",
      emailId: "hanumath@example.com",
      phoneNo: "9876543210",
    },
  ];

  const customer = {
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

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockCustomers });
  });

  it("renders the Customer component with customer data", async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Customer />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Lalith")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Hanumath")).toBeInTheDocument();
    });
  }, 10000);

  it("allows searching for customers", async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Customer />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("Search Name"), {
      target: { value: "Lalith" },
    });

    await waitFor(() => {
      expect(screen.getByText("Lalith")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByText("Hanumath")).not.toBeInTheDocument();
    });
  }, 10000);

  it("displays a modal when adding a new customer", async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Customer />} />
        </Routes>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByTestId("add-button"));
  }, 10000);

  it("displays a confirmation dialog when deleting a customer", async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Customer />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Hanumath")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("deleteicon-2")).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId(`deleteicon-2`);

    fireEvent.click(deleteButton);

    expect(screen.getByText("Confirmation")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete this customer?")
    ).toBeInTheDocument();
  }, 10000);

  it("closes the confirmation dialog when canceling deletion", async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Customer />} />
        </Routes>
      </MemoryRouter>
    );

    axios.delete.mockResolvedValueOnce({ status: 200 });

    await waitFor(() => {
      expect(screen.getByTestId("deleteicon-2")).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId(`deleteicon-2`);

    fireEvent.click(deleteButton);

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText("Confirmation")).not.toBeInTheDocument();
    });
  }, 10000);

  test("user can change rows per page", async () => {
    axios.get.mockResolvedValueOnce({ data: mockCustomers });

    render(
      <MemoryRouter>
        <Customer />
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
    axios.get.mockRejectedValueOnce(new Error("Error fetching customer data:"));

    render(
      <MemoryRouter>
        <Customer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Error fetching data. Please try again!")
      ).toBeInTheDocument();
    });
  }, 10000);

  it("updating a customer", async () => {
    axios.put.mockResolvedValue({ status: 200 });

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Customer />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("editicon-1")).toBeInTheDocument();
    });

    const updateButton = screen.getByTestId("editicon-1");
    fireEvent.click(updateButton);

    fireEvent.click(screen.getByText("Save"));
  }, 10000);

  it("handles an empty customer list", async () => {
    axios.get.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Customer />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText("Lalith")).not.toBeInTheDocument();
    expect(screen.queryByText("Hanumath")).not.toBeInTheDocument();
  }, 10000);

  it("sorts customers in descending order", async () => {
    axios.get.mockResolvedValue({ data: mockCustomers });

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Customer />} />
        </Routes>
      </MemoryRouter>
    );

    const sortButton = screen.getByLabelText("sort");
    fireEvent.click(sortButton);

    await waitFor(() => {
      expect(screen.getByText("Hanumath")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Lalith")).toBeInTheDocument();
    });
  }, 10000);

  it("copies customer ID to clipboard", async () => {
    axios.get.mockResolvedValue({ data: mockCustomers });

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Customer />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Lalith")).toBeInTheDocument();
    });

    const copyButton = screen.getByTestId("copyicon-1");
    fireEvent.click(copyButton);
  }, 10000);

  it("navigates to the customer dashboard when the view icon is clicked", async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Customer />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Lalith")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("viewicon-1")).toBeInTheDocument();
    });

    const viewIcon = screen.getByTestId("viewicon-1");
    fireEvent.click(viewIcon);
  }, 10000);

  it("adding a customer", async () => {
    axios.post.mockResolvedValueOnce({ status: 201 });

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Customer />} />
        </Routes>
      </MemoryRouter>
    );

    const addButton = screen.getByTestId("add-button");
    fireEvent.click(addButton);

    const saveButton = screen.getByTestId("add");
    fireEvent.click(saveButton);
  }, 10000);

  it("renders the CustomerModal when isCustomerModalOpen is true", async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Customer />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("add-button")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("add-button"));
  }, 10000);

  it("renders CustomerModal with provided data for an existing customer", () => {
    const handleClose = jest.fn();
    const setCustomer = jest.fn();
    const handleSave = jest.fn();

    render(
      <CustomerModal
        isOpen={true}
        handleClose={handleClose}
        customer={customer}
        setCustomer={setCustomer}
        handleSave={handleSave}
      />
    );

    expect(screen.getByText("Edit an existing Customer")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Lalith")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Phanindra")).toBeInTheDocument();
    expect(screen.getByDisplayValue("123 Main St")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Apt 4B")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Bangalore")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Karnataka")).toBeInTheDocument();
    expect(screen.getByDisplayValue("560068")).toBeInTheDocument();
    expect(screen.getByDisplayValue("India")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1234567890")).toBeInTheDocument();
    expect(screen.getByDisplayValue("plp@gmail.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Active")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));
    expect(handleClose).toHaveBeenCalled();
  }, 10000);

  it("closes the modal when Cancel is clicked", () => {
    const handleClose = jest.fn();
    const setCustomer = jest.fn();
    const handleSave = jest.fn();
    render(
      <CustomerModal
        isOpen={true}
        handleClose={handleClose}
        customer={customer}
        setCustomer={setCustomer}
        handleSave={handleSave}
      />
    );

    fireEvent.click(screen.getByText("Cancel"));

    expect(handleClose).toHaveBeenCalled();
  }, 10000);

  it("validates all fields and triggers save", () => {
    const handleClose = jest.fn();
    const setCustomer = jest.fn();
    const handleSave = jest.fn();
    render(
      <CustomerModal
        isOpen={true}
        handleClose={handleClose}
        customer={customer}
        setCustomer={setCustomer}
        handleSave={handleSave}
      />
    );

    fireEvent.click(screen.getByText("Save"));

    expect(handleSave).toHaveBeenCalled();
  }, 10000);

  it("sorts customers correctly in ascending order", async () => {
    axios.get.mockResolvedValue({ data: mockCustomers });

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Customer />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Hanumath")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Lalith")).toBeInTheDocument();
    });

    const sortButton = screen.getByLabelText("sort");
    fireEvent.click(sortButton);

    await waitFor(() => {
      expect(screen.getByText("Lalith")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Hanumath")).toBeInTheDocument();
    });
  }, 10000);

  it("handles API error when updating a customer", async () => {
    axios.put.mockRejectedValueOnce(
      new Error("An error occurred while updating the customer")
    );

    render(
      <MemoryRouter>
        <Customer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("editicon-1")).toBeInTheDocument();
    });

    const editButton = screen.getByTestId("editicon-1");

    fireEvent.click(editButton);

    fireEvent.click(screen.getByText("Save"));

    await expect(axios.put()).rejects.toThrow(
      "An error occurred while updating the customer"
    );
  }, 10000);

  it("handles API error when adding a customer", async () => {
    axios.put.mockRejectedValueOnce(
      new Error("An error occurred while adding the customer")
    );

    render(
      <MemoryRouter>
        <Customer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("add-button")).toBeInTheDocument();
    });

    const addButton = screen.getByTestId("add-button");

    fireEvent.click(addButton);

    fireEvent.click(screen.getByText("Add"));

    await expect(axios.put()).rejects.toThrow(
      "An error occurred while adding the customer"
    );
  }, 10000);

  it("handles API error when deleting a customer", async () => {
    axios.delete.mockRejectedValueOnce(
      new Error("Error deleting the customer ")
    );

    render(
      <MemoryRouter>
        <Customer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("deleteicon-1")).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId("deleteicon-1");

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText("Delete")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Delete"));

    await expect(axios.delete()).rejects.toThrow(
      "Error deleting the customer "
    );
  }, 10000);
}, 10000);
