import { describe, it, expect } from 'vitest';
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import Navbar from "../components/Navbar";

vi.mock('firebase/auth', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getAuth: vi.fn(() => ({})),
    onAuthStateChanged: vi.fn((_auth, callback) => {
      callback(null);
      return () => {};
    }),
    GoogleAuthProvider: vi.fn(),
    GithubAuthProvider: vi.fn(),
    signInWithPopup: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    updateProfile: vi.fn(),
  };
});

describe("Navbar", () => {
  it("renders brand name", async () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <AuthProvider>
            <Navbar />
          </AuthProvider>
        </CartProvider>
      </BrowserRouter>
    );
    // Accessible name combines "Casa " + "Simpson" across the span
    expect(await screen.findByRole('link', { name: /Casa Simpson/i })).toBeInTheDocument();
  });

  it("renders nav links", async () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <AuthProvider>
            <Navbar />
          </AuthProvider>
        </CartProvider>
      </BrowserRouter>
    );
    expect(await screen.findByText(/Home/i)).toBeInTheDocument();
    expect(await screen.findByText(/Rooms/i)).toBeInTheDocument();
  });
});