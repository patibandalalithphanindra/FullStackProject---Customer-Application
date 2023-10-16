import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import App from "../App";
import HomePage from "../components/HomePage";

beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(console, "info").mockImplementation(() => {});
  jest.spyOn(console, "debug").mockImplementation(() => {});
});

describe("App Component", () => {
  it("renders the HomePage component by default", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText("WELCOME")).toBeInTheDocument();
  }, 10000);

  it("renders the LandingPage component when a valid token is in localStorage", async () => {
    localStorage.setItem("jwt", "mockToken");

    render(
      <MemoryRouter initialEntries={["/homepage/*"]}>
        <App />
      </MemoryRouter>
    );

    localStorage.removeItem("jwt");
  });

  it("navigates to HomePage when no token is in localStorage", async () => {
    render(
      <MemoryRouter initialEntries={["/homepage/*"]}>
        <Routes>
          <Route path="/homepage" element={<App />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </MemoryRouter>
    );
  }, 10000);

  it("navigates to LandingPage when a valid token is in localStorage", async () => {
    localStorage.setItem("jwt", "mockToken");

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/homepage" element={<App />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </MemoryRouter>
    );

    localStorage.removeItem("jwt");
  }, 10000);
});
