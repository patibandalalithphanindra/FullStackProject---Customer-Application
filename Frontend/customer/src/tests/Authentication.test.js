import axios from 'axios';
import { userRegister, userLogin } from '../service/Authentication';

jest.mock('axios');

describe('HTTP Request Functions', () => {
  it('should send a POST request for user registration', async () => {
    const mockUserData = {
      username: 'testuser',
      password: 'password123',
    };

    axios.post.mockResolvedValueOnce({ data: 'Registration successful' });

    const response = await userRegister(mockUserData);

    expect(response).toBe('Registration successful');
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/user/add'),
      mockUserData
    );
  });

  it('should send a POST request for user login', async () => {
    const mockLoginData = {
      username: 'testuser',
      password: 'password123',
    };

    axios.post.mockResolvedValueOnce({ data: 'Login successful' }); // Mock the login response

    await userLogin(mockLoginData); // Call userLogin without expecting a return value

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/user/authenticate'),
      mockLoginData,
      expect.any(Object) // Ensure headers are present
    );
  });

  it('should handle errors during registration', async () => {
    const mockUserData = {
      username: 'testuser',
      password: 'password123',
    };

    const errorMessage = 'Registration failed';
    axios.post.mockRejectedValueOnce(new Error(errorMessage));

    await expect(userRegister(mockUserData)).rejects.toThrow(errorMessage);
  });

  it('should handle errors during login', async () => {
    const mockLoginData = {
      username: 'testuser',
      password: 'password123',
    };

    const errorMessage = 'Login failed';
    axios.post.mockRejectedValueOnce(new Error(errorMessage));

    await expect(userLogin(mockLoginData)).rejects.toThrow(errorMessage);
  });
});
