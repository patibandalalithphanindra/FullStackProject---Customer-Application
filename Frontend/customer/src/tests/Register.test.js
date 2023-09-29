import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Register from '../components/Register';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');

test('renders Register component', () => {
  render(<MemoryRouter><Register /></MemoryRouter>);
  const registerElement = screen.getByText(/Switch to Login/);
  expect(registerElement).toBeInTheDocument();
});

beforeEach(() => {
  localStorage.clear();
});

test('user can fill and submit registration form', async () => {
  axios.post.mockResolvedValueOnce({
    status: 200,
    data: {
      token: 'token',
      name: 'User',
    },
  });

  render(<MemoryRouter><Register /></MemoryRouter>);

  const nameInput = screen.getByLabelText(/Username/i);
  const emailInput = screen.getByLabelText(/Email/i);
  const passwordInput = screen.getByLabelText(/Password/i);

  fireEvent.change(nameInput, { target: { value: 'testuser' } });
  fireEvent.change(emailInput, { target: { value: 'testuser@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'testpassword' } });

  fireEvent.submit(screen.getByRole('button', { name: /Register/i }));

  await waitFor(() => {
    expect(localStorage.getItem('jwt')).toEqual('token');
  });

  await waitFor(() => {
    expect(localStorage.getItem('name')).toEqual('User');
  });
});
