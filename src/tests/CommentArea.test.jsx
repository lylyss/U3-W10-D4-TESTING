import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import CommentArea from "../components/CommentArea";

const mockBooks = [
  { id: 1, title: "Book One", genre: "Fiction" },
  { id: 2, title: "Book Two", genre: "Non-Fiction" },
];

describe("CommentArea Component", () => {
  afterEach(() => {
    cleanup();
    global.fetch.mockClear();
  });

  it("should render the CommentArea component correctly", () => {
    render(<CommentArea asin="12345" />);
    expect(screen.getByText(/Add a comment/i)).toBeInTheDocument();
  });

  it("should not render any SingleComment components initially", () => {
    render(<CommentArea asin="12345" />);
    const singleCommentElements = screen.queryAllByTestId("single-comment");
    expect(singleCommentElements.length).toBe(0);
  });

  it("should load and display comments when a book with reviews is clicked", async () => {
    const mockComments = [
      { id: 1, comment: "Great book!", rate: 5 },
      { id: 2, comment: "Not bad", rate: 3 },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockComments),
      })
    );

    render(<CommentArea asin="12345" />);
    const commentList = await screen.findByTestId("comment-list");
    expect(commentList).toBeInTheDocument();
    expect(screen.getByText(/Great book!/i)).toBeInTheDocument();
    expect(screen.getByText(/Not bad/i)).toBeInTheDocument();
  });

  it("should change the border color of a book when clicked", () => {
    const { container } = render(<CommentArea asin="12345" />);
    const bookElement = container.querySelector(".book");
    fireEvent.click(bookElement);
    expect(bookElement).toHaveClass("selected-border");
  });

  it("should reset the border color of the first book when a second book is clicked", () => {
    const { container } = render(<CommentArea asin="12345" />);
    const firstBook = container.querySelector(".book:first-child");
    const secondBook = container.querySelector(".book:nth-child(2)");

    fireEvent.click(firstBook);
    expect(firstBook).toHaveClass("selected-border");

    fireEvent.click(secondBook);
    expect(firstBook).not.toHaveClass("selected-border");
    expect(secondBook).toHaveClass("selected-border");
  });

  it("should filter books correctly via the navbar", () => {
    render(<CommentArea books={mockBooks} />);
    const navbarInput = screen.getByPlaceholderText(/Search/i);

    fireEvent.change(navbarInput, { target: { value: "Fiction" } });
    const filteredBooks = screen.getAllByTestId("book");
    expect(filteredBooks.length).toBe(1);
    expect(filteredBooks[0]).toHaveTextContent("Book One");
  });

  it("should show all books when the search input is empty", () => {
    render(<CommentArea books={mockBooks} />);
    const navbarInput = screen.getByPlaceholderText(/Search/i);

    fireEvent.change(navbarInput, { target: { value: "" } });
    const allBooks = screen.getAllByTestId("book");
    expect(allBooks.length).toBe(2);
  });

  it("should show no books if the search input does not match any book", () => {
    render(<CommentArea books={mockBooks} />);
    const navbarInput = screen.getByPlaceholderText(/Search/i);

    fireEvent.change(navbarInput, { target: { value: "Nonexistent" } });
    const filteredBooks = screen.queryAllByTestId("book");
    expect(filteredBooks.length).toBe(0);
  });

  it("should filter books in a case-insensitive manner", () => {
    render(<CommentArea books={mockBooks} />);
    const navbarInput = screen.getByPlaceholderText(/Search/i);

    fireEvent.change(navbarInput, { target: { value: "fiction" } });
    const filteredBooks = screen.getAllByTestId("book");
    expect(filteredBooks.length).toBe(1);
    expect(filteredBooks[0]).toHaveTextContent("Book One");
  });
});
