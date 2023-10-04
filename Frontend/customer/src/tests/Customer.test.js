import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Customer from '../components/Customer';

jest.mock('axios');

describe('Customer Component', () => {
  const mockCustomers = [
    {
      customerId: 1,
      firstName: 'Lalith',
      lastName: 'Phanindra',
      emailId: 'lalith@example.com',
      phoneNo: '1234567890',
    },
    {
      customerId: 2,
      firstName: 'Hanumath',
      lastName: 'Prasad',
      emailId: 'hanumath@example.com',
      phoneNo: '9876543210',
    },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockCustomers });
  });

  it('renders the Customer component with customer data', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Customer />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Lalith')).toBeInTheDocument();
    });

    await waitFor(() => {
        expect(screen.getByText('Hanumath')).toBeInTheDocument();
      });
  });

  it('allows searching for customers', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Customer />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Search Name'), {
      target: { value: 'Lalith' },
    });

    await waitFor(() => {
      expect(screen.getByText('Lalith')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByText('Hanumath')).not.toBeInTheDocument();
      });
  });

  it('displays a modal when adding a new customer', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Customer />} />
        </Routes>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByTestId('add-button'));
  });

  it('displays a confirmation dialog when deleting a customer', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Customer />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Hanumath')).toBeInTheDocument();
    });

    await waitFor(()=> {
      expect(screen.getByTestId("deleteicon-2")).toBeInTheDocument();
    })
  
    const deleteButton = screen.getByTestId(`deleteicon-2`);

    fireEvent.click(deleteButton);
  
    expect(screen.getByText('Confirmation')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this customer?')).toBeInTheDocument();
  });
  
  it('closes the confirmation dialog when canceling deletion', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Customer />} />
        </Routes>
      </MemoryRouter>
    );
  
    axios.delete.mockResolvedValueOnce({ status: 200 });

    await waitFor(()=> {
      expect(screen.getByTestId("deleteicon-2")).toBeInTheDocument();
    })
  
    const deleteButton = screen.getByTestId(`deleteicon-2`);

    fireEvent.click(deleteButton);
  
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
  
    await waitFor(() => {
      expect(screen.queryByText('Confirmation')).not.toBeInTheDocument();
    });
  });  

  test('user can change rows per page', async () => {
    axios.get.mockResolvedValueOnce({ data: mockCustomers });
  
    render(<MemoryRouter><Customer/></MemoryRouter>);
  
    const rowsPerPageSelect = screen.getByLabelText(/Rows per page/i);
    fireEvent.mouseDown(rowsPerPageSelect);
    const option = screen.getByText('10'); 
    fireEvent.click(option);
  
    await waitFor(() => {
      expect(screen.getAllByRole('row').length).toBe(3);
    });
  });
  
  test('handles API error', async () => {
    axios.get.mockRejectedValueOnce(new Error('API error'));
  
    render(<MemoryRouter><Customer/></MemoryRouter>);
  
    await waitFor(() => {
      expect(screen.getByText('Error fetching data. Please try again!')).toBeInTheDocument();
    });
  });

  it('updating a customer', async () => {
    axios.put.mockResolvedValue({ status: 200 });
    
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Customer />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(()=> {
      expect(screen.getByTestId("editicon-1")).toBeInTheDocument();
    })
  
    const updateButton = screen.getByTestId('editicon-1');
    fireEvent.click(updateButton);

    fireEvent.click(screen.getByText('Save'));
  
  });

  it('handles an empty customer list', async () => {
    axios.get.mockResolvedValue({ data: [] });
  
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Customer />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Lalith')).not.toBeInTheDocument();
    expect(screen.queryByText('Hanumath')).not.toBeInTheDocument();
  
  });

  it('sorts customers in descending order', async () => {
    axios.get.mockResolvedValue({ data: mockCustomers });
  
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Customer />} />
        </Routes>
      </MemoryRouter>
    );
  
    const sortButton = screen.getByLabelText('sort');
    fireEvent.click(sortButton);
  
    await waitFor(() => {
      expect(screen.getByText('Hanumath')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Lalith')).toBeInTheDocument();
    });
  });

  // it('copies customer ID to clipboard', async () => {
  //   axios.get.mockResolvedValue({ data: mockCustomers });
  
  //   render(
  //     <MemoryRouter>
  //       <Routes>
  //         <Route path="/" element={<Customer />} />
  //       </Routes>
  //     </MemoryRouter>
  //   );
  
  //   const copyButton = screen.getByTestId('copyicon-1');
  //   fireEvent.click(copyButton);
  
  //   await waitFor(() => {
  //     expect(screen.getByText('Customer Id copied successfully!')).toBeInTheDocument();
  //   });
  // });

  it('navigates to the customer dashboard when the view icon is clicked', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Customer />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Lalith')).toBeInTheDocument();
    });

    await waitFor(()=> {
      expect(screen.getByTestId("viewicon-1")).toBeInTheDocument();
    })

    const viewIcon = screen.getByTestId('viewicon-1');
    fireEvent.click(viewIcon);
  });

  it('adding a customer', async () => {
    axios.post.mockResolvedValueOnce({ status: 201 });
  
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Customer />} />
        </Routes>
      </MemoryRouter>
    );
  
    const addButton = screen.getByTestId('add-button');
    fireEvent.click(addButton);
  
    const saveButton = screen.getByTestId('add');
    fireEvent.click(saveButton);
  });

 });



