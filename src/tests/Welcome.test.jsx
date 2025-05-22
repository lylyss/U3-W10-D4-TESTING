import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Welcome from "../components/Welcome";

describe("Welcome Component", () => {
  it("should render the Welcome component correctly", () => {
    render(<Welcome />);
    const headingElement = screen.getByText(/Benvenuti in EpiBooks!/i);
    expect(headingElement).toBeInTheDocument();
  });
});
