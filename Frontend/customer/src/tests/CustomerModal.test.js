import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomerModal from '../components/Customer/CustomerModal';

describe('CustomerModal Component', () => {
  const customer = {
    customerId: 1,
    firstName: 'Lalith',
    lastName: 'Phanindra',
    emailId: 'plp@gmail.com',
    phoneNo: '1234567890',
    addressLine1: '123 Main St',
    addressLine2: 'Apt 4B',
    city: 'Bangalore',
    state: 'Karnataka',
    zipCode: '560068',
    country: 'India',
    status: 'Active',
  };

  it('renders CustomerModal for editing an existing customer', () => {
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

    expect(screen.getByText('Edit an existing Customer')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Lalith')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Phanindra')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123 Main St')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Apt 4B')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Bangalore')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Karnataka')).toBeInTheDocument();
    expect(screen.getByDisplayValue('560068')).toBeInTheDocument();
    expect(screen.getByDisplayValue('India')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
    expect(screen.getByDisplayValue('plp@gmail.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Active')).toBeInTheDocument();    
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('renders CustomerModal for adding a new customer', () => {
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

    expect(screen.getByText('Add a new Customer')).toBeInTheDocument();
  });

  it('validates all fields and triggers save', () => {
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

    fireEvent.click(screen.getByText('Save'));

    expect(handleSave).toHaveBeenCalled();
  });

  it('validates and does not trigger save on missing fields', async () => {
    const handleClose = jest.fn();
    const setCustomer = jest.fn();
    const handleSave = jest.fn();
  
    const initialCustomer = {
      firstName: '',
      lastName: '',
      addressLine1: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      phoneNo: '',
      emailId: '',
      status: 'Active',
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
  
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));
  
    await screen.findAllByText('This field is required.');
  
    expect(handleSave).not.toHaveBeenCalled();
    const errorMessages = screen.queryAllByText('This field is required.');

    expect(handleSave).not.toHaveBeenCalled();
    expect(errorMessages).toHaveLength(7);
    
  });
  
  it('validates and does not trigger save on invalid phone number', () => {
    const handleClose = jest.fn();
    const setCustomer = jest.fn();
    const handleSave = jest.fn();

    render(
      <CustomerModal
        isOpen={true}
        handleClose={handleClose}
        customer={{ ...customer, phoneNo: '1234' }}
        setCustomer={setCustomer}
        handleSave={handleSave}
      />
    );

    fireEvent.click(screen.getByText('Save'));

    expect(handleSave).not.toHaveBeenCalled();
    expect(
      screen.getByText('This field is required and must be 10 digits.')
    ).toBeInTheDocument();
  });

  it('validates and does not trigger save on invalid email', () => {
    const handleClose = jest.fn();
    const setCustomer = jest.fn();
    const handleSave = jest.fn();

    render(
      <CustomerModal
        isOpen={true}
        handleClose={handleClose}
        customer={{ ...customer, emailId: 'invalid-email' }}
        setCustomer={setCustomer}
        handleSave={handleSave}
      />
    );

    fireEvent.click(screen.getByText('Save'));

    expect(handleSave).not.toHaveBeenCalled();
    expect(
      screen.getByText('This field is required and must be a valid email address.')
    ).toBeInTheDocument();
  });

  it('validates and triggers save on valid input', () => {
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
  
    fireEvent.click(screen.getByText('Save'));
  
    expect(handleSave).toHaveBeenCalled();
    expect(
      screen.queryByText('This field is required.')
    ).not.toBeInTheDocument();
  });

  it('validates and does not trigger save on editing with invalid email', () => {
    const handleClose = jest.fn();
    const setCustomer = jest.fn();
    const handleSave = jest.fn();
  
    render(
      <CustomerModal
        isOpen={true}
        handleClose={handleClose}
        customer={{ ...customer, emailId: 'invalid-email' }}
        setCustomer={setCustomer}
        handleSave={handleSave}
      />
    );
  
    fireEvent.click(screen.getByText('Save'));
  
    expect(handleSave).not.toHaveBeenCalled();
    expect(
      screen.getByText('This field is required and must be a valid email address.')
    ).toBeInTheDocument();
  });

  it('closes the modal when Cancel is clicked', () => {
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
  
    fireEvent.click(screen.getByText('Cancel'));
  
    expect(handleClose).toHaveBeenCalled();
  });
});
