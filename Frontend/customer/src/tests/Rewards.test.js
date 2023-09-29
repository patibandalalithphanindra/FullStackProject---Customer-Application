import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Reward from '../components/Reward';
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
