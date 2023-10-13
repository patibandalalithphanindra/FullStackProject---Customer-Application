import axios from 'axios';
import { userRegister, userLogin } from '../service/Authentication';

jest.mock('axios');

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'info').mockImplementation(() => {});
  jest.spyOn(console, 'debug').mockImplementation(() => {});
});

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
  }, 10000);

  it('should send a POST request for user login', async () => {
    const mockLoginData = {
      username: 'testuser',
      password: 'password123',
    };

    axios.post.mockResolvedValueOnce({ data: 'Login successful' });

    await userLogin(mockLoginData);

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/user/authenticate'),
      mockLoginData,
      expect.any(Object)
    );
  }, 10000);

  it('should handle errors during registration', async () => {
    const mockUserData = {
      username: 'testuser',
      password: 'password123',
    };

    const errorMessage = 'Registration failed';
    axios.post.mockRejectedValueOnce(new Error(errorMessage));

    await expect(userRegister(mockUserData)).rejects.toThrow(errorMessage);
  }, 10000);

  it('should handle errors during login', async () => {
    const mockLoginData = {
      username: 'testuser',
      password: 'password123',
    };

    const errorMessage = 'Login failed';
    axios.post.mockRejectedValueOnce(new Error(errorMessage));

    await expect(userLogin(mockLoginData)).rejects.toThrow(errorMessage);
  }, 10000);

  it('should handle empty response during user registration', async () => {
    const mockUserData = {
      username: 'testuser',
      password: 'password123',
    };
  
    axios.post.mockResolvedValueOnce({ data: undefined });
  
    const response = await userRegister(mockUserData);
  
    expect(response).toBeUndefined();
  }, 10000);

  it('should handle missing CSRF token', async () => {
    jest.spyOn(document, 'cookie', 'get').mockReturnValue('');
  
    const mockUserData = {
      username: 'testuser',
      password: 'password123',
    };
  
    const errorMessage = 'CSRF token not found';
    axios.post.mockRejectedValueOnce(new Error(errorMessage));
  
    await expect(userRegister(mockUserData)).rejects.toThrow(errorMessage);
  }, 10000);

  it('should handle invalid user registration data', async () => {
    const mockUserData = {
    };
  
    const errorMessage = 'Invalid data';
    axios.post.mockRejectedValueOnce(new Error(errorMessage));
  
    await expect(userRegister(mockUserData)).rejects.toThrow(errorMessage);
  }, 10000);
  
});
