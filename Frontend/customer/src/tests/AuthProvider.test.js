import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../service/AuthContext';

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'info').mockImplementation(() => {});
  jest.spyOn(console, 'debug').mockImplementation(() => {});
});

describe('AuthProvider', () => {
  it('should render children and provide authentication context', () => {
    const TestComponent = () => {
      const { user, login, logout } = useAuth();

      return (
        <div>
          <div data-testid="user">{user}</div>
          <button data-testid="login" onClick={() => login('testuser')}>
            Login
          </button>
          <button data-testid="logout" onClick={logout}>
            Logout
          </button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const userElement = screen.getByTestId('user');
    const loginButton = screen.getByTestId('login');
    const logoutButton = screen.getByTestId('logout');

    expect(userElement).toHaveTextContent('');
    expect(loginButton).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();

    userEvent.click(loginButton);
    expect(userElement).toHaveTextContent('testuser');

    userEvent.click(logoutButton);
    expect(userElement).toHaveTextContent('');
  });
});
