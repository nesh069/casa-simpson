import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Home from "../pages/Home";

vi.mock("../hooks/useFirestore", () => ({
  useRooms: () => ({
    rooms: [
      { id: "1", name: "Executive Suite", price: 350, capacity: 2, description: "Luxury", imageUrl: "test.jpg", type: "suite" },
    ],
    loading: false,
    error: null
  }),
  useReviews: () => ({
    reviews: [
      { id: "1", guestName: "Sarah M.", comment: "Great stay!", stayDate: "2025-04-10", roomName: "Executive Suite", isVerified: true },
    ],
    loading: false,
    error: null
  })
}));

describe("Home Page", () => {
  it("renders hero section", () => {
    render(<BrowserRouter><AuthProvider><Home /></AuthProvider></BrowserRouter>);
    expect(screen.getByText(/Welcome to Casa Simpson/i)).toBeInTheDocument();
  });

  it("renders featured rooms", () => {
    render(<BrowserRouter><AuthProvider><Home /></AuthProvider></BrowserRouter>);
    expect(screen.getByText(/Featured Rooms/i)).toBeInTheDocument();
  });

  it("renders CTA section", () => {
    render(<BrowserRouter><AuthProvider><Home /></AuthProvider></BrowserRouter>);
    expect(screen.getByText(/Ready for an Unforgettable Stay/i)).toBeInTheDocument();
  });
});