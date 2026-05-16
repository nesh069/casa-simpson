import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";

describe("Navbar", () => {
  it("renders brand name", () => {
    render(<BrowserRouter><AuthProvider><Navbar /></AuthProvider></BrowserRouter>);
    expect(screen.getByText(/Casa Simpson/i)).toBeInTheDocument();
  });

  it("renders nav links", () => {
    render(<BrowserRouter><AuthProvider><Navbar /></AuthProvider></BrowserRouter>);
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Rooms/i)).toBeInTheDocument();
  });
});