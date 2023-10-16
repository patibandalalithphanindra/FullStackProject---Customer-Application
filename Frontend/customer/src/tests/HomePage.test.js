import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import HomePage from "../components/HomePage";
import { MemoryRouter } from "react-router-dom";

describe("HomePage Component", () => {
  it("renders the login form by default", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText("WELCOME")).toBeInTheDocument();
    expect(screen.getByTestId("username")).toBeInTheDocument();
    expect(screen.getByTestId("password")).toBeInTheDocument();
    expect(screen.getByTestId("login")).toBeInTheDocument();
  }, 10000);

  it("renders the registration form when toggle button is clicked", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const toggleButton = screen.getByText("Switch to Register");
    fireEvent.click(toggleButton);

    expect(screen.getByText("WELCOME")).toBeInTheDocument();
    expect(screen.getByTestId("username")).toBeInTheDocument();
    expect(screen.getByTestId("email")).toBeInTheDocument();
    expect(screen.getByTestId("password")).toBeInTheDocument();
    expect(screen.getByTestId("register")).toBeInTheDocument();
  }, 10000);

  it("toggles between login and registration forms when the toggle button is clicked", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText("WELCOME")).toBeInTheDocument();
    expect(screen.getByTestId("username")).toBeInTheDocument();
    expect(screen.getByTestId("password")).toBeInTheDocument();

    const toggleButton = screen.getByText("Switch to Register");
    fireEvent.click(toggleButton);

    expect(screen.getByText("WELCOME")).toBeInTheDocument();
    expect(screen.getByTestId("username")).toBeInTheDocument();
    expect(screen.getByTestId("email")).toBeInTheDocument();
    expect(screen.getByTestId("password")).toBeInTheDocument();
    expect(screen.getByTestId("register")).toBeInTheDocument();

    fireEvent.click(toggleButton);

    expect(screen.getByText("WELCOME")).toBeInTheDocument();
    expect(screen.getByTestId("username")).toBeInTheDocument();
    expect(screen.getByTestId("password")).toBeInTheDocument();
  }, 10000);
});
