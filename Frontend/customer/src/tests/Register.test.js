import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Register from "../components/Register";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";

jest.mock("axios");
jest.mock("react-toastify");

test("renders Register component", () => {
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );
  const registerElement = screen.getByText(/Switch to Login/);
  expect(registerElement).toBeInTheDocument();
});

beforeEach(() => {
  localStorage.clear();
});

test("user can fill and submit registration form", async () => {
  axios.post.mockResolvedValueOnce({
    status: 200,
    data: {
      token: "token",
      name: "User",
    },
  });

  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );

  const nameInput = screen.getByLabelText(/Username/i);
  const emailInput = screen.getByLabelText(/Email/i);
  const passwordInput = screen.getByLabelText(/Password/i);

  fireEvent.change(nameInput, { target: { value: "testuser" } });
  fireEvent.change(emailInput, { target: { value: "testuser@example.com" } });
  fireEvent.change(passwordInput, { target: { value: "testpassword" } });

  fireEvent.submit(screen.getByRole("button", { name: /Register/i }));

  await waitFor(() => {
    expect(localStorage.getItem("jwt")).toEqual("token");
  });

  await waitFor(() => {
    expect(localStorage.getItem("name")).toEqual("User");
  });

  expect(toast.success).toHaveBeenCalledWith("Registered Successfully!", {
    position: toast.POSITION.BOTTOM_LEFT,
    autoClose: 900,
  });
}, 10000);

test("user receives an error message on registration failure", async () => {
  axios.post.mockRejectedValueOnce(new Error("Registration failed"));

  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );

  fireEvent.submit(screen.getByRole("button", { name: /Register/i }));

  await waitFor(() => {
    expect(localStorage.getItem("jwt")).toBeNull();
  });

  expect(toast.error).toHaveBeenCalledWith(
    "Invalid email address. Please enter a valid email.",
    { position: toast.POSITION.BOTTOM_LEFT, autoClose: 900 }
  );
}, 10000);

test("user cannot submit with an invalid email", async () => {
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );

  const emailInput = screen.getByLabelText(/Email/i);

  fireEvent.change(emailInput, { target: { value: "invalid-email" } });
  fireEvent.submit(screen.getByRole("button", { name: /Register/i }));

  await waitFor(() => {
    expect(localStorage.getItem("jwt")).toBeNull();
  });

  expect(toast.error).toHaveBeenCalledWith(
    "Invalid email address. Please enter a valid email.",
    { position: toast.POSITION.BOTTOM_LEFT, autoClose: 900 }
  );
}, 10000);
