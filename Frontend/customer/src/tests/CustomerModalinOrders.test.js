import { render, screen } from '@testing-library/react';
import React from 'react';
import axios from 'axios';
import CustomerDetailsModal from '../components/Order/CustomerDetailsModal';

jest.mock('axios');

describe('CustomerDetailsModal Component', () => {
  const customerData = {
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

  it('renders customer details when loading is complete', async () => {
    axios.get.mockResolvedValue({ data: customerData });

    render(
      <CustomerDetailsModal customerId={1} isOpen={true} handleClose={() => {}} />
    );

  });

  it('closes the modal when Close button is clicked', async () => {
    const handleClose = jest.fn();
    axios.get.mockResolvedValue({ data: customerData });

    render(
      <CustomerDetailsModal customerId={1} isOpen={true} handleClose={handleClose} />
    );

    const closeButton = screen.getByText('Close');
    closeButton.click();

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
