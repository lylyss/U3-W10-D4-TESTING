import { render, screen } from "@testing-library/react";
import App from "../App";

describe("App", () => {
  it("renders the App component", () => {
    render(<App />);
    screen.findAllByText(/a simple react-test example/i);

    screen.debug();
  });
});
