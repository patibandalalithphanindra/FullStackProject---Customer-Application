import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderModal from '../components/Order/OrderModal';

describe('OrderModal Component', () => {
  const orderData = {
    orderNo: 1,
    customerId: '123',
    currency: 'INR',
    orderStatus: 'Created',
  };

  const orderItemsMenu = [
    { itemId: 1, itemName: 'Item1' },
    { itemId: 2, itemName: 'Item2' },
  ];

  const orderItemsD = [
    { itemId: 1, itemName: 'Item1', quantity: 2 },
    { itemId: 2, itemName: 'Item2', quantity: 3 },
  ];

  const setOrderItemsD = jest.fn();
  const setWithCoins = jest.fn();
  const setOrderData = jest.fn();
  const handleSave = jest.fn();

  it('renders OrderModal for editing an existing order', () => {
    render(
      <OrderModal
        isOpen={true}
        handleClose={() => {}}
        orderData={orderData}
        orderItemsMenu={orderItemsMenu}
        orderItemsD={orderItemsD}
        setOrderItemsD={setOrderItemsD}
        withCoins={'yes'}
        setWithCoins={setWithCoins}
        setOrderData={setOrderData}
        handleSave={handleSave}
      />
    );

    expect(screen.getByText('Edit an existing Order')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123')).toBeInTheDocument();
    expect(screen.getByDisplayValue('INR')).toBeInTheDocument();
    expect(screen.getByText('Created')).toBeInTheDocument();
  });

  it('renders OrderModal for adding a new order', () => {
    render(
      <OrderModal
        isOpen={true}
        handleClose={() => {}}
        orderData={{}}
        orderItemsMenu={orderItemsMenu}
        orderItemsD={orderItemsD}
        setOrderItemsD={setOrderItemsD}
        withCoins={'yes'}
        setWithCoins={setWithCoins}
        setOrderData={setOrderData}
        handleSave={handleSave}
      />
    );

    expect(screen.getByText('Add a new Order')).toBeInTheDocument();
  });

  it('validates and does not trigger save on missing fields', async () => {
    render(
      <OrderModal
        isOpen={true}
        handleClose={() => {}}
        orderData={{}}
        orderItemsMenu={orderItemsMenu}
        orderItemsD={[]}
        setOrderItemsD={setOrderItemsD}
        withCoins={'yes'}
        setWithCoins={setWithCoins}
        setOrderData={setOrderData}
        handleSave={handleSave}
      />
    );

    fireEvent.click(screen.getByText('Add'));

    await screen.findAllByText('This field is required.');

    expect(handleSave).not.toHaveBeenCalled();
  });
  
  it('handles the save button click', () => {
    render(
      <OrderModal
        isOpen={true}
        handleClose={() => {}}
        orderData={orderData}
        orderItemsMenu={orderItemsMenu}
        orderItemsD={orderItemsD}
        setOrderItemsD={setOrderItemsD}
        withCoins={'yes'}
        setWithCoins={setWithCoins}
        setOrderData={setOrderData}
        handleSave={handleSave}
      />
    );

    const addButton = screen.getByText('Update');
    fireEvent.click(addButton);

    expect(handleSave).toHaveBeenCalledWith('Items Packed');
  });

  it('removes an item when "Remove Item" button is clicked', async () => {
    render(
      <OrderModal
      isOpen={true}
      handleClose={() => {}}
      orderData={orderData}
      orderItemsMenu={orderItemsMenu}
      orderItemsD={orderItemsD}
      setOrderItemsD={setOrderItemsD}
      withCoins={'yes'}
      setWithCoins={setWithCoins}
      setOrderData={setOrderData}
      handleSave={handleSave}
      />
    );
  
    userEvent.selectOptions(screen.getByLabelText('Select Item'), 'Item1');
    userEvent.type(screen.getByLabelText('Quantity'), '2');
    fireEvent.click(screen.getByLabelText('Add'));
  
    expect(screen.getByText('Item1')).toBeInTheDocument();
  
    fireEvent.click(screen.getByLabelText('Delete'));
  
    await waitFor(() => {
      expect(screen.queryByText('Item1')).toBeNull();
    });
  });
  

it('displays an error for an invalid quantity', async () => {
  render(
    <OrderModal
    isOpen={true}
    handleClose={() => {}}
    orderData={{}}
    orderItemsMenu={orderItemsMenu}
    orderItemsD={orderItemsD}
    setOrderItemsD={setOrderItemsD}
    withCoins={true}
    setWithCoins={setWithCoins}
    setOrderData={setOrderData}
    handleSave={handleSave}
    />
  );

  const addItemButton = screen.getByLabelText('Add');
  fireEvent.click(addItemButton);

  await waitFor(() => {
    expect(screen.getByText('Should be greater than zero')).toBeInTheDocument();
  });
});


});