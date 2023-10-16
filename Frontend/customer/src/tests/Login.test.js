import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Login from "../components/Login";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import LandingPage from "../components/LandingPage";

jest.mock("axios");

beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(console, "info").mockImplementation(() => {});
  jest.spyOn(console, "debug").mockImplementation(() => {});
});

afterEach(() => {
  localStorage.clear();
});

test("renders Login component", () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
  const loginElement = screen.getByText(/Switch to Register/);
  expect(loginElement).toBeInTheDocument();
}, 10000);

beforeEach(() => {
  localStorage.clear();
});

test("user can log in", async () => {
  localStorage.setItem("username", "testuser");
  localStorage.setItem("password", "testpassword");

  axios.post.mockResolvedValueOnce({
    data: {
      token: "token",
      name: "User",
    },
    status: 200,
  });

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  fireEvent.submit(screen.getByRole("button", { name: /Login/i }));

  await waitFor(() => {
    expect(localStorage.getItem("jwt")).toEqual("token");
  });

  await waitFor(() => {
    expect(localStorage.getItem("name")).toEqual("User");
  });
}, 20000);

test("user switches to Register form", () => {
  const toggleForm = jest.fn();

  render(
    <MemoryRouter>
      <Login toggleForm={toggleForm} />
    </MemoryRouter>
  );

  fireEvent.click(screen.getByText(/Switch to Register/));

  expect(toggleForm).toHaveBeenCalled();
}, 10000);

test("when login fails", async () => {
  axios.post.mockRejectedValueOnce(new Error("Login error:"));

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  const usernameInput = screen.getByTestId("username");
  const passwordInput = screen.getByTestId("password");

  usernameInput.value = "testuser";
  passwordInput.value = "testpassword";

  fireEvent.click(screen.getByTestId("login"));

  expect(screen.getByText(/Switch to Register/)).toBeInTheDocument();
  await expect(axios.post()).rejects.toThrow("Login error:");
}, 10000);

test("user is redirected to landingpage after successful login", async () => {
  axios.post.mockResolvedValueOnce({
    data: {
      token: "token",
      name: "user",
    },
    status: 200,
  });

  render(
    <MemoryRouter>
      <Login />
      <Routes>
        <Route
          path="/homepage"
          element={
            <div>
              <LandingPage />
            </div>
          }
        />
      </Routes>
    </MemoryRouter>
  );

  fireEvent.submit(screen.getByTestId("login"));
}, 10000);
