import React from "react";
import { render, screen } from "@testing-library/react";
import Profile from "../components/Customer/Dashboard/Profile";

describe("Profile Component", () => {
  const customer = {
    firstName: "Lalith",
    lastName: "Phanindra",
    emailId: "plp@gmail.com",
    phoneNo: "1234567890",
    addressLine1: "123 Main St",
    addressLine2: "Apt 4B",
    city: "Bangalore",
    state: "Karnataka",
    zipCode: "560068",
    country: "India",
    status: "Active",
  };

  it("renders customer information", () => {
    render(<Profile customer={customer} />);

    const matchText = (content, text) => {
      const cleanedContent = content.replace(/\s+/g, " ").trim();
      const cleanedText = text.replace(/\s+/g, " ").trim();
      return cleanedContent === cleanedText;
    };

    expect(
      screen.getByText((content, element) => {
        return matchText(element.textContent, "Name : Lalith Phanindra");
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText((content, element) => {
        return matchText(element.textContent, "Mobile Number : 1234567890");
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText((content, element) => {
        return matchText(element.textContent, "Email Id : plp@gmail.com");
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText((content, element) => {
        return matchText(element.textContent, "Status : Active");
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText((content, element) => {
        return matchText(element.textContent, "Address : 123 Main St, Apt 4B");
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText((content, element) => {
        return matchText(element.textContent, "City : Bangalore");
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText((content, element) => {
        return matchText(element.textContent, "State : Karnataka");
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText((content, element) => {
        return matchText(element.textContent, "Country : India");
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText((content, element) => {
        return matchText(element.textContent, "Zip Code : 560068");
      })
    ).toBeInTheDocument();
  }, 10000);

  it("renders customer avatar", () => {
    render(<Profile customer={customer} />);

    const avatar = screen.getByAltText("Customer Avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute(
      "src",
      "https://www.pngitem.com/pimgs/m/62-625606_computer-icons-suit-image-avatar-clip-art-customer.png"
    );
  });
}, 10000);
