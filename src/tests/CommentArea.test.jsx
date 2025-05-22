import { render, screen } from "@testing-library/react";
import CommentArea from "../components/CommentArea";

describe("CommentArea Component", () => {
  it("should render the CommentArea component correctly", () => {
    render(<CommentArea asin="12345" />);
    const addCommentText = screen.getByText(/Add a comment/i);
    expect(addCommentText).toBeInTheDocument();
  });
});
