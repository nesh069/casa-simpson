import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Rooms from "../pages/Rooms";

vi.mock("../hooks/useFirestore", () => ({
  useRoomsRealtime: () => ({
    rooms: [
      { id: "1", name: "Executive Suite", price: 350, capacity: 2, description: "Luxury", imageUrl: "test.jpg", type: "suite", beds: "1 King" },
    ],
    loading: false
  })
}));

describe("Rooms Page", () => {
  it("renders room listing", () => {
    render(<BrowserRouter><Rooms /></BrowserRouter>);
    expect(screen.getByText(/Our Rooms/i)).toBeInTheDocument();
  });
});