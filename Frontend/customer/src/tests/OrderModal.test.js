import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OrderModal from "../components/Order/OrderModal";
import axios from "axios";

jest.mock("axios");
beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(console, "info").mockImplementation(() => {});
  jest.spyOn(console, "debug").mockImplementation(() => {});
});

describe("OrderModal Component", () => {
  const orderData = {
    orderNo: 1,
    customerId: "123",
    currency: "₹",
    orderStatus: "Created",
  };

  const orderItemsMenu = [
    { itemId: 1, itemName: "Item1" },
    { itemId: 2, itemName: "Item2" },
  ];

  const orderItemsD = [
    { itemId: 1, itemName: "Item1", quantity: 2 },
    { itemId: 2, itemName: "Item2", quantity: 3 },
  ];

  const setOrderItemsD = jest.fn();
  const setWithCoins = jest.fn();
  const setOrderData = jest.fn();
  const handleSave = jest.fn();

  it("renders OrderModal for editing an existing order", () => {
    render(
      <OrderModal
        isOpen={true}
        handleClose={() => {}}
        orderData={orderData}
        orderItemsMenu={orderItemsMenu}
        orderItemsD={orderItemsD}
        setOrderItemsD={setOrderItemsD}
        withCoins={"yes"}
        setWithCoins={setWithCoins}
        setOrderData={setOrderData}
        handleSave={handleSave}
      />
    );

    expect(screen.getByText("Edit an existing Order")).toBeInTheDocument();
    expect(screen.getByDisplayValue("123")).toBeInTheDocument();
    expect(screen.getByDisplayValue("₹")).toBeInTheDocument();
    expect(screen.getByText("Created")).toBeInTheDocument();
  });

  it("renders OrderModal for adding a new order", () => {
    render(
      <OrderModal
        isOpen={true}
        handleClose={() => {}}
        orderData={{}}
        orderItemsMenu={orderItemsMenu}
        orderItemsD={orderItemsD}
        setOrderItemsD={setOrderItemsD}
        withCoins={"yes"}
        setWithCoins={setWithCoins}
        setOrderData={setOrderData}
        handleSave={handleSave}
      />
    );

    expect(screen.getByText("Add a new Order")).toBeInTheDocument();
  }, 10000);

  it("validates and does not trigger save on missing fields", async () => {
    render(
      <OrderModal
        isOpen={true}
        handleClose={() => {}}
        orderData={{}}
        orderItemsMenu={orderItemsMenu}
        orderItemsD={[]}
        setOrderItemsD={setOrderItemsD}
        withCoins={"yes"}
        setWithCoins={setWithCoins}
        setOrderData={setOrderData}
        handleSave={handleSave}
      />
    );

    fireEvent.click(screen.getByText("Add"));

    await screen.findAllByText("This field is required.");

    expect(handleSave).not.toHaveBeenCalled();
  }, 10000);

  it("handles the save button click", () => {
    render(
      <OrderModal
        isOpen={true}
        handleClose={() => {}}
        orderData={orderData}
        orderItemsMenu={orderItemsMenu}
        orderItemsD={orderItemsD}
        setOrderItemsD={setOrderItemsD}
        withCoins={"yes"}
        setWithCoins={setWithCoins}
        setOrderData={setOrderData}
        handleSave={handleSave}
      />
    );

    const addButton = screen.getByText("Pack");
    fireEvent.click(addButton);

    expect(handleSave).toHaveBeenCalledWith("Packed");
  }, 10000);

  it('removes an item when "Remove Item" button is clicked', async () => {
    axios.get.mockResolvedValueOnce({ status: 200 });

    render(
      <OrderModal
        isOpen={true}
        handleClose={() => {}}
        orderData={{}}
        orderItemsMenu={orderItemsMenu}
        orderItemsD={orderItemsD}
        setOrderItemsD={setOrderItemsD}
        withCoins={"yes"}
        setWithCoins={setWithCoins}
        setOrderData={setOrderData}
        handleSave={handleSave}
      />
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Select Item")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("selectlabel"));
    fireEvent.click(screen.getByText("Item1"));
    userEvent.type(screen.getByLabelText("Quantity"), "2");
    fireEvent.click(screen.getByLabelText("Add"));

    expect(screen.getByText("Item1")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("delete-1"));

    await waitFor(() => {
      expect(screen.getByText("Item1")).toBeInTheDocument();
    });
  }, 10000);

  it("displays an error if item is not selected", async () => {
    render(
      <OrderModal
        isOpen={true}
        handleClose={() => {}}
        orderData={{}}
        orderItemsMenu={orderItemsMenu}
        orderItemsD={orderItemsD}
        setOrderItemsD={setOrderItemsD}
        withCoins={"yes"}
        setWithCoins={setWithCoins}
        setOrderData={setOrderData}
        handleSave={handleSave}
      />
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Select Item")).toBeInTheDocument();
    });

    const addItemButton = screen.getByLabelText("Add");
    fireEvent.click(addItemButton);

    await waitFor(() => {
      expect(screen.getByText("Please select an item")).toBeInTheDocument();
    });
  }, 10000);

  it("validates and triggers save when all fields are filled correctly", async () => {
    const orderItemsMenu = [
      { itemId: 1, itemName: "Item1" },
      { itemId: 2, itemName: "Item2" },
    ];

    render(
      <OrderModal
        isOpen={true}
        handleClose={() => {}}
        orderData={{}}
        orderItemsMenu={orderItemsMenu}
        orderItemsD={orderItemsD}
        setOrderItemsD={setOrderItemsD}
        withCoins={"yes"}
        setWithCoins={setWithCoins}
        setOrderData={setOrderData}
        handleSave={handleSave}
      />
    );

    fireEvent.click(screen.getByTestId("selectlabel"));
    fireEvent.click(screen.getByText("Item1"));
    const addButton = screen.getByLabelText("Add");
    fireEvent.click(addButton);

    const saveButton = screen.getByText("Add");
    fireEvent.click(saveButton);
  }, 10000);

  it("displays the correct quantity when an item is added", async () => {
    axios.get.mockResolvedValueOnce({ status: 200 });

    render(
      <OrderModal
        isOpen={true}
        handleClose={() => {}}
        orderData={{}}
        orderItemsMenu={orderItemsMenu}
        orderItemsD={orderItemsD}
        setOrderItemsD={setOrderItemsD}
        withCoins={"yes"}
        setWithCoins={setWithCoins}
        setOrderData={setOrderData}
        handleSave={handleSave}
      />
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Select Item")).toBeInTheDocument();
    });
    userEvent.type(screen.getByLabelText("Quantity"), "2");
    fireEvent.click(screen.getByLabelText("Add"));

    expect(screen.getByText("Item1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  }, 10000);

  it("validates and does not trigger save when quantity is not provided", async () => {
    render(
      <OrderModal
        isOpen={true}
        handleClose={() => {}}
        orderData={{}}
        orderItemsMenu={orderItemsMenu}
        orderItemsD={orderItemsD}
        setOrderItemsD={setOrderItemsD}
        withCoins={"yes"}
        setWithCoins={setWithCoins}
        setOrderData={setOrderData}
        handleSave={handleSave}
      />
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Select Item")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText("Add"));
  }, 10000);

  it('displays the correct "Next Status" when an order is being updated', () => {
    const orderData = {
      orderNo: 1,
      customerId: "123",
      currency: "₹",
      orderStatus: "Created",
    };

    render(
      <OrderModal
        isOpen={true}
        handleClose={() => {}}
        orderData={orderData}
        orderItemsMenu={orderItemsMenu}
        orderItemsD={orderItemsD}
        setOrderItemsD={setOrderItemsD}
        withCoins={"yes"}
        setWithCoins={setWithCoins}
        setOrderData={setOrderData}
        handleSave={handleSave}
      />
    );

    expect(screen.getByText("Pack")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Pack"));
  }, 10000);

  it('returns the correct next status for "Created" order status', () => {
    const orderData = {
      orderNo: 1,
      customerId: "123",
      currency: "₹",
      orderStatus: "Created",
    };

    render(
      <OrderModal
        isOpen={true}
        handleClose={() => {}}
        orderData={orderData}
        orderItemsMenu={orderItemsMenu}
        orderItemsD={orderItemsD}
        setOrderItemsD={setOrderItemsD}
        withCoins={"yes"}
        setWithCoins={setWithCoins}
        setOrderData={setOrderData}
        handleSave={handleSave}
      />
    );

    const nextStatusText = screen.getByText("Pack");

    expect(nextStatusText).toBeInTheDocument();
  }, 10000);

  it('returns the correct next status for "Packed" order status', () => {
    const orderData = {
      orderNo: 1,
      customerId: "123",
      currency: "₹",
      orderStatus: "Packed",
    };

    render(
      <OrderModal
        isOpen={true}
        handleClose={() => {}}
        orderData={orderData}
        orderItemsMenu={orderItemsMenu}
        orderItemsD={orderItemsD}
        setOrderItemsD={setOrderItemsD}
        withCoins={"yes"}
        setWithCoins={setWithCoins}
        setOrderData={setOrderData}
        handleSave={handleSave}
      />
    );

    const nextStatusText = screen.getByText("Ship");

    expect(nextStatusText).toBeInTheDocument();
  }, 10000);

  it('returns the correct next status for "Shipped" order status', () => {
    const orderData = {
      orderNo: 1,
      customerId: "123",
      currency: "₹",
      orderStatus: "Shipped",
    };

    render(
      <OrderModal
        isOpen={true}
        handleClose={() => {}}
        orderData={orderData}
        orderItemsMenu={orderItemsMenu}
        orderItemsD={orderItemsD}
        setOrderItemsD={setOrderItemsD}
        withCoins={"yes"}
        setWithCoins={setWithCoins}
        setOrderData={setOrderData}
        handleSave={handleSave}
      />
    );

    const nextStatusText = screen.getByText("Transit");

    expect(nextStatusText).toBeInTheDocument();
  }, 10000);

  it('returns the correct next status for "In Transit" order status', () => {
    const orderData = {
      orderNo: 1,
      customerId: "123",
      currency: "₹",
      orderStatus: "In Transit",
    };

    render(
      <OrderModal
        isOpen={true}
        handleClose={() => {}}
        orderData={orderData}
        orderItemsMenu={orderItemsMenu}
        orderItemsD={orderItemsD}
        setOrderItemsD={setOrderItemsD}
        withCoins={"yes"}
        setWithCoins={setWithCoins}
        setOrderData={setOrderData}
        handleSave={handleSave}
      />
    );

    const nextStatusText = screen.getByText("Deliver");

    expect(nextStatusText).toBeInTheDocument();
  }, 10000);
});
