import { render, screen } from "@testing-library/react";
import BookList from "../components/BookList";
import fantasy from "../data/fantasy.json";

describe("BookList Component", () => {
  it("should render the correct number of Bootstrap cards", () => {
    render(<BookList books={fantasy} />);
    const bookCards = screen.getAllByRole("img");
    expect(bookCards.length).toBe(fantasy.length);
  });
});
