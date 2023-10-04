import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Login from '../components/Login';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');

test('renders Login component', () => {
  render(<MemoryRouter><Login /></MemoryRouter>);
  const loginElement = screen.getByText(/Switch to Register/);
  expect(loginElement).toBeInTheDocument();
});

beforeEach(() => {
  localStorage.clear();
});

test('user can log in', async () => {
  localStorage.setItem('username', 'testuser');
  localStorage.setItem('password', 'testpassword');

  axios.post.mockResolvedValueOnce({
    data: {
      token: 'token',
      name: 'User',
    },
    status: 200,
  });

  render(<MemoryRouter><Login/></MemoryRouter>);

  fireEvent.submit(screen.getByRole('button', { name: /Login/i }));

  await waitFor(() => {
    expect(localStorage.getItem('jwt')).toEqual('token');
  });

  await waitFor(() => {
    expect(localStorage.getItem('name')).toEqual('User');
  });
});

test('user switches to Register form', () => {
  const toggleForm = jest.fn();

  render(<MemoryRouter><Login toggleForm={toggleForm} /></MemoryRouter>);

  fireEvent.click(screen.getByText(/Switch to Register/));

  expect(toggleForm).toHaveBeenCalled();
});

test('user sees an error message when login fails', async () => {
  axios.post.mockRejectedValueOnce(new Error('Login failed'));

  render(<MemoryRouter><Login /></MemoryRouter>);

  const usernameInput = screen.getByTestId('username');
  const passwordInput = screen.getByTestId('password');

  usernameInput.value = 'testuser';
  passwordInput.value = 'testpassword';

  fireEvent.click(screen.getByTestId('login'));

  expect(screen.getByText(/Switch to Register/)).toBeInTheDocument();
});





