import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Rewards from "../components/Customer/Dashboard/Rewards";
import fetchMock from "jest-fetch-mock";

describe("Rewards Component", () => {
  beforeAll(() => {
    fetchMock.enableMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "info").mockImplementation(() => {});
    jest.spyOn(console, "debug").mockImplementation(() => {});
  });

  beforeEach(() => {
    fetchMock.resetMocks();
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => "testAccessToken"),
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders SVG icons", () => {
    render(<Rewards id="1" />);

    const monetizationOnIcon = screen.getByTestId("earned");
    expect(monetizationOnIcon).toBeInTheDocument();

    const moneyOffIcon = screen.getByTestId("redeemed");
    expect(moneyOffIcon).toBeInTheDocument();

    const attachMoneyIcon = screen.getByTestId("balance");
    expect(attachMoneyIcon).toBeInTheDocument();
  }, 10000);

  it("renders rewards summary", async () => {
    const mockRewardsData = [50, 20, 30];

    fetchMock.mockResponseOnce(JSON.stringify(mockRewardsData), {
      headers: {
        Authorization: "Bearer testAccessToken",
        "Content-Type": "application/json",
      },
    });

    render(<Rewards id="1" />);

    await waitFor(() => {
      expect(screen.getByText("Earned Coins")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Redeemed Coins")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Balance Coins")).toBeInTheDocument();
    });

    await waitFor(() => {
      const noteText =
        "Note : Earned Coins represent the total coins earned, Redeemed Coins represent the coins spent or redeemed, and Balance Coins represent the remaining coins.";
      const noteElement = screen.getByText(noteText);
      expect(noteElement).toBeInTheDocument();
    });
  });
}, 10000);
