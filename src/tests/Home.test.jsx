import { describe, it, expect } from 'vitest';
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Home from "../pages/Home";

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

vi.mock('../hooks/useFirestore', () => ({
  useDocument: vi.fn(() => ({ data: null, loading: false })),
  useCollection: vi.fn(() => ({
    data: [
      {
        id: '1',
        name: 'Deluxe Suite',
        price: 250,
        type: 'suite',
        image: '',
        description: 'A lovely suite',
        amenities: ['WiFi', 'TV', 'AC', 'Mini Bar'],   // <-- add this
      },
    ],
    loading: false,
  })),
}));

describe("Home Page", () => {
  it("renders hero section", async () => {
    render(
      <BrowserRouter>
        <AuthProvider><Home /></AuthProvider>
      </BrowserRouter>
    );
    expect(await screen.findByText(/Welcome to/i)).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: /Casa Simpson/i })).toBeInTheDocument();
  });

  it("renders featured rooms", async () => {
    render(
      <BrowserRouter>
        <AuthProvider><Home /></AuthProvider>
      </BrowserRouter>
    );
    expect(await screen.findByText(/Featured Rooms/i)).toBeInTheDocument();
  });

  it("renders CTA section", async () => {
    render(
      <BrowserRouter>
        <AuthProvider><Home /></AuthProvider>
      </BrowserRouter>
    );
    expect(await screen.findByText(/Ready for an Unforgettable Stay/i)).toBeInTheDocument();
  });
});