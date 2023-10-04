import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Reward, {formatDate} from '../components/Reward';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');

const mockRewardsData = [
  {
    rewardsId: 1,
    customerId: 'C1',
    orderNo: 'O123',
    rewardsEarned: 50,
    rewardsDate: '2023-01-01T12:00:00Z',
  },
  {
    rewardsId: 2,
    customerId: 'C2',
    orderNo: 'O124',
    rewardsEarned: 75,
    rewardsDate: '2023-01-02T14:30:00Z',
  },
];

test('renders Reward component', async () => {
  axios.get.mockResolvedValueOnce({ data: mockRewardsData });

  render(<MemoryRouter><Reward/></MemoryRouter>);

  await waitFor(() => {
    expect(screen.getByText('REWARDS INFORMATION')).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByText('Reward ID')).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByText('Customer Id')).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByText('Order No')).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByText('Rewards Earned')).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByText('Date')).toBeInTheDocument();
  });
});

test('user can search rewards by customer ID', async () => {
  axios.get.mockResolvedValueOnce({ data: mockRewardsData });

  render(<MemoryRouter><Reward/></MemoryRouter>);

  const searchInput = screen.getByLabelText(/Search Customer ID/i);
  fireEvent.change(searchInput, { target: { value: 'C1' } });

  await waitFor(() => {
    expect(screen.queryByText('C2')).not.toBeInTheDocument();
  });
});

test('user can sort rewards by date', async () => {
  axios.get.mockResolvedValueOnce({ data: mockRewardsData });

  render(<MemoryRouter><Reward/></MemoryRouter>);

  const sortButton = screen.getByRole('button', { name: /sort/i });
  fireEvent.click(sortButton);

  await waitFor(() => {
    const rewardItems = screen.getAllByText(/C\d/);
    expect(rewardItems[0]).toHaveTextContent('C2');
  });

  await waitFor(() => {
    const rewardItems = screen.getAllByText(/C\d/);
    expect(rewardItems[1]).toHaveTextContent('C1');
  });
});

test('displays empty rows when there are no rewards', async () => {
  axios.get.mockResolvedValueOnce({ data: [] });

  render(<MemoryRouter><Reward/></MemoryRouter>);

  await waitFor(() => {
    expect(screen.getByText('REWARDS INFORMATION')).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByText('Reward ID')).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByText('Customer Id')).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByText('Order No')).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByText('Rewards Earned')).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByText('Date')).toBeInTheDocument();
  });
});

test('user can search and sort rewards', async () => {
  axios.get.mockResolvedValueOnce({ data: mockRewardsData });

  render(<MemoryRouter><Reward/></MemoryRouter>);

  const searchInput = screen.getByLabelText(/Search Customer ID/i);
  fireEvent.change(searchInput, { target: { value: 'C1' } });

  await waitFor(() => {
    expect(screen.getByText('C1')).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.queryByText('C2')).not.toBeInTheDocument();
  });

  const sortButton = screen.getByRole('button', { name: /sort/i });
  fireEvent.click(sortButton);

  await waitFor(() => {
    const rewardItems = screen.getAllByText(/C\d/);
    expect(rewardItems[0]).toHaveTextContent('C1');
  });
});

test('user can change rows per page', async () => {
  axios.get.mockResolvedValueOnce({ data: mockRewardsData });

  render(<MemoryRouter><Reward/></MemoryRouter>);

  const rowsPerPageSelect = screen.getByLabelText(/Rows per page/i);
  fireEvent.mouseDown(rowsPerPageSelect);
  const option = screen.getByText('10'); 
  fireEvent.click(option);

  await waitFor(() => {
    expect(screen.getAllByRole('row').length).toBe(3);
  });
});

test('handles API error gracefully', async () => {
  axios.get.mockRejectedValueOnce(new Error('API error'));

  render(<MemoryRouter><Reward/></MemoryRouter>);

  await waitFor(() => {
    expect(screen.getByText('Error fetching data. Please try again!')).toBeInTheDocument();
  });
});

test('formats date correctly', () => {
  const dateToFormat = '2023-01-01T12:00:00Z';
  const expectedFormattedDate = '01/01/2023, 05:30 PM';
  const formattedDate = formatDate(dateToFormat);
  expect(formattedDate).toBe(expectedFormattedDate);
});


test('renders Reward component with ascending and descending sorting', async () => { 
  axios.get.mockResolvedValueOnce({ data: mockRewardsData });

  render(<MemoryRouter><Reward/></MemoryRouter>);

  await waitFor(() => {
    const rewardItems = screen.getAllByText(/C\d/);
    expect(rewardItems[0]).toHaveTextContent('C1');
  });

  await waitFor(() => {
    const rewardItems = screen.getAllByText(/C\d/);
    expect(rewardItems[1]).toHaveTextContent('C2');
  });


  const sortButton = screen.getByRole('button', { name: /sort/i });
  fireEvent.click(sortButton);
  
  await waitFor(() => {
    const rewardItems = screen.getAllByText(/C\d/);
    expect(rewardItems[0]).toHaveTextContent('C2');
  });

  await waitFor(() => {
    const rewardItems = screen.getAllByText(/C\d/);
    expect(rewardItems[1]).toHaveTextContent('C1');
  });
});

