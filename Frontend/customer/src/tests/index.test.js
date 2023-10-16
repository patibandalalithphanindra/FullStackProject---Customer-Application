import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../service/AuthContext";
import App from "../App";

jest.mock("../service/AuthContext", () => ({
  AuthProvider: ({ children }) => <div>{children}</div>,
}));

describe("App Component", () => {
  it("renders the App component with AuthProvider and Router", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("WELCOME")).toBeInTheDocument();
  }, 10000);
});
