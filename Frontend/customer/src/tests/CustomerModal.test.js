import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CustomerModal from "../components/Customer/CustomerModal";

describe("CustomerModal Component", () => {
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

  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "info").mockImplementation(() => {});
    jest.spyOn(console, "debug").mockImplementation(() => {});
  });

  it("renders CustomerModal for editing an existing customer", () => {
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
  }, 10000);

  it("renders CustomerModal for adding a new customer", () => {
    const handleClose = jest.fn();
    const setCustomer = jest.fn();
    const handleSave = jest.fn();

    render(
      <CustomerModal
        isOpen={true}
        handleClose={handleClose}
        customer={{}}
        setCustomer={setCustomer}
        handleSave={handleSave}
      />
    );

    expect(screen.getByText("Add a new Customer")).toBeInTheDocument();
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

  it("validates and does not trigger save on missing fields", async () => {
    const handleClose = jest.fn();
    const setCustomer = jest.fn();
    const handleSave = jest.fn();

    const initialCustomer = {
      firstName: "",
      lastName: "",
      addressLine1: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      phoneNo: "",
      emailId: "",
      status: "Active",
    };

    render(
      <CustomerModal
        isOpen={true}
        handleClose={handleClose}
        customer={initialCustomer}
        setCustomer={setCustomer}
        handleSave={handleSave}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    await screen.findAllByText("This field is required.");

    expect(handleSave).not.toHaveBeenCalled();
    const errorMessages = screen.queryAllByText("This field is required.");

    expect(handleSave).not.toHaveBeenCalled();
    expect(errorMessages).toHaveLength(7);
  }, 10000);

  it("validates and does not trigger save on invalid phone number", () => {
    const handleClose = jest.fn();
    const setCustomer = jest.fn();
    const handleSave = jest.fn();

    render(
      <CustomerModal
        isOpen={true}
        handleClose={handleClose}
        customer={{ ...customer, phoneNo: "1234" }}
        setCustomer={setCustomer}
        handleSave={handleSave}
      />
    );

    fireEvent.click(screen.getByText("Save"));

    expect(handleSave).not.toHaveBeenCalled();
    expect(
      screen.getByText("This field is required and must be 10 digits.")
    ).toBeInTheDocument();
  }, 10000);

  it("validates and does not trigger save on invalid email", () => {
    const handleClose = jest.fn();
    const setCustomer = jest.fn();
    const handleSave = jest.fn();

    render(
      <CustomerModal
        isOpen={true}
        handleClose={handleClose}
        customer={{ ...customer, emailId: "invalid-email" }}
        setCustomer={setCustomer}
        handleSave={handleSave}
      />
    );

    fireEvent.click(screen.getByText("Save"));

    expect(handleSave).not.toHaveBeenCalled();
    expect(
      screen.getByText(
        "This field is required and must be a valid email address."
      )
    ).toBeInTheDocument();
  }, 10000);

  it("validates and triggers save on valid input", () => {
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
    expect(
      screen.queryByText("This field is required.")
    ).not.toBeInTheDocument();
  }, 10000);

  it("validates and does not trigger save on editing with invalid email", () => {
    const handleClose = jest.fn();
    const setCustomer = jest.fn();
    const handleSave = jest.fn();

    render(
      <CustomerModal
        isOpen={true}
        handleClose={handleClose}
        customer={{ ...customer, emailId: "invalid-email" }}
        setCustomer={setCustomer}
        handleSave={handleSave}
      />
    );

    fireEvent.click(screen.getByText("Save"));

    expect(handleSave).not.toHaveBeenCalled();
    expect(
      screen.getByText(
        "This field is required and must be a valid email address."
      )
    ).toBeInTheDocument();
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

  it("validates and triggers save on valid input for a new customer", () => {
    const handleClose = jest.fn();
    const setCustomer = jest.fn();
    const handleSave = jest.fn();

    const newCustomer = {
      firstName: "Ramu",
      lastName: "Ravi",
      addressLine1: "456 B",
      city: "Chennai",
      state: "TamilNadu",
      zipCode: "613401",
      country: "India",
      phoneNo: "9876513220",
      emailId: "ramuravi@gmail.com",
      status: "Active",
    };

    render(
      <CustomerModal
        isOpen={true}
        handleClose={handleClose}
        customer={newCustomer}
        setCustomer={setCustomer}
        handleSave={handleSave}
      />
    );

    fireEvent.click(screen.getByText("Add"));

    expect(handleSave).toHaveBeenCalled();
    expect(
      screen.queryByText("This field is required.")
    ).not.toBeInTheDocument();
  }, 10000);

  it("validates and triggers save on valid input for editing an existing customer", () => {
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
    expect(
      screen.queryByText("This field is required.")
    ).not.toBeInTheDocument();
  }, 10000);

  it("validates and does not trigger save on invalid status", () => {
    const handleClose = jest.fn();
    const setCustomer = jest.fn();
    const handleSave = jest.fn();

    render(
      <CustomerModal
        isOpen={true}
        handleClose={handleClose}
        customer={{ ...customer, status: "" }}
        setCustomer={setCustomer}
        handleSave={handleSave}
      />
    );

    fireEvent.click(screen.getByText("Save"));

    expect(handleSave).not.toHaveBeenCalled();
    expect(screen.getByText("This field is required.")).toBeInTheDocument();
  }, 10000);

  it("displays error messages for required fields", async () => {
    const handleClose = jest.fn();
    const setCustomer = jest.fn();
    const handleSave = jest.fn();

    const initialCustomer = {
      firstName: "",
      lastName: "",
      addressLine1: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      phoneNo: "",
      emailId: "",
      status: "",
    };

    render(
      <CustomerModal
        isOpen={true}
        handleClose={handleClose}
        customer={initialCustomer}
        setCustomer={setCustomer}
        handleSave={handleSave}
      />
    );

    fireEvent.click(screen.getByText("Add"));

    const errorMessages = screen.getAllByText("This field is required.");
    errorMessages.forEach((errorMessage) => {
      expect(errorMessage).toBeInTheDocument();
    });
  }, 10000);

  it("displays error message for required fields if they are empty", () => {
    const handleClose = jest.fn();
    const setCustomer = jest.fn();
    const handleSave = jest.fn();
    render(
      <CustomerModal
        isOpen={true}
        handleClose={handleClose}
        customer={{
          firstName: "",
          lastName: "",
          addressLine1: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
          phoneNo: "",
          emailId: "",
          status: "",
        }}
        setCustomer={setCustomer}
        handleSave={handleSave}
      />
    );
    fireEvent.click(screen.getByTestId("add"));

    expect(screen.getAllByText("This field is required.")).toHaveLength(8);
  }, 10000);

  it("updates zipCode when user enters a value", () => {
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
    const zipCodeInput = screen.getByTestId("zipcode");

    fireEvent.change(zipCodeInput, {
      target: { value: "123456" },
    });

    expect(setCustomer).toHaveBeenCalledWith({
      ...customer,
      zipCode: "123456",
    });
  }, 10000);

  it("updates firstname when user enters a value", () => {
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
    const firstNameInput = screen.getByTestId("firstname");

    fireEvent.change(firstNameInput, {
      target: { value: "Ravi" },
    });

    expect(setCustomer).toHaveBeenCalledWith({
      ...customer,
      firstName: "Ravi",
    });
  }, 10000);

  it("updates lastname when user enters a value", () => {
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
    const lastNameInput = screen.getByTestId("lastname");

    fireEvent.change(lastNameInput, {
      target: { value: "Ramu" },
    });

    expect(setCustomer).toHaveBeenCalledWith({
      ...customer,
      lastName: "Ramu",
    });
  }, 10000);

  it("updates city when user enters a value", () => {
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
    const cityInput = screen.getByTestId("city");

    fireEvent.change(cityInput, {
      target: { value: "Vijayawada" },
    });

    expect(setCustomer).toHaveBeenCalledWith({
      ...customer,
      city: "Vijayawada",
    });
  }, 10000);

  it("updates state when user enters a value", () => {
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
    const stateInput = screen.getByTestId("state");

    fireEvent.change(stateInput, {
      target: { value: "AndhraPradesh" },
    });

    expect(setCustomer).toHaveBeenCalledWith({
      ...customer,
      state: "AndhraPradesh",
    });
  }, 10000);

  it("updates country when user enters a value", () => {
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
    const countryInput = screen.getByTestId("country");

    fireEvent.change(countryInput, {
      target: { value: "England" },
    });

    expect(setCustomer).toHaveBeenCalledWith({
      ...customer,
      country: "England",
    });
  }, 10000);

  it("updates address line 1 when user enters a value", () => {
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
    const addressInput1 = screen.getByTestId("add1");

    fireEvent.change(addressInput1, {
      target: { value: "Hongkong" },
    });

    expect(setCustomer).toHaveBeenCalledWith({
      ...customer,
      addressLine1: "Hongkong",
    });
  }, 10000);

  it("updates address line 2 when user enters a value", () => {
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
    const addressInput2 = screen.getByTestId("add2");

    fireEvent.change(addressInput2, {
      target: { value: "Hongkong" },
    });

    expect(setCustomer).toHaveBeenCalledWith({
      ...customer,
      addressLine2: "Hongkong",
    });
  }, 100000);

  it("updates phone number when user enters a value", () => {
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
    const mobileInput = screen.getByTestId("phonenumber");

    fireEvent.change(mobileInput, {
      target: { value: "9876512340" },
    });

    expect(setCustomer).toHaveBeenCalledWith({
      ...customer,
      phoneNo: "9876512340",
    });
  }, 10000);

  it("updates email when user enters a value", () => {
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
    const emailInput = screen.getByTestId("email");

    fireEvent.change(emailInput, {
      target: { value: "rk@gmail.com" },
    });

    expect(setCustomer).toHaveBeenCalledWith({
      ...customer,
      emailId: "rk@gmail.com",
    });
  }, 10000);

  it("updates status when user selects a value from the dropdown", () => {
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

    const statusSelect = screen.getByTestId("status");

    fireEvent.change(statusSelect, {
      target: { value: "Inactive" },
    });

    expect(setCustomer).toHaveBeenCalledWith({
      ...customer,
      status: "Inactive",
    });
  }, 10000);
});
