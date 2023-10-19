import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

describe("App Component", () => {
  it("renders the App component with AuthProvider and Router", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
          <App />
      </MemoryRouter>
    );

    expect(screen.getByText("WELCOME")).toBeInTheDocument();
  }, 10000);
});
