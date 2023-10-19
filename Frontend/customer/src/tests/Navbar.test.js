import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import { toast } from "react-toastify";

const localStorageMock = {
  clear: jest.fn(),
};

global.localStorage.clear = jest.fn();

jest.mock("react-toastify", () => ({
  toast: {
    POSITION: {
      BOTTOM_LEFT: "BOTTOM_LEFT",
    },
    success: jest.fn(),
  },
}));

describe("Navbar Component", () => {
  it("renders without errors", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText("Order Management System")).toBeInTheDocument();
  }, 10000);

  it("handles logout correctly", async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("logout-button"));

    expect(screen.getByText("Confirmation")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(localStorageMock.clear).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId("logout"));

    expect(toast.success).toHaveBeenCalled();
  }, 10000);

  it("navigates back when the back button is clicked", () => {
    const history = createMemoryHistory();
    render(
      <MemoryRouter history={history}>
        <Navbar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("back-button"));

    expect(history.location.pathname).toBe("/");
  }, 10000);
});
