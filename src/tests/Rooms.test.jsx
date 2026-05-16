import { describe, it, expect } from 'vitest';
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Rooms from "../pages/Rooms";

vi.mock('../hooks/useFirestore', () => ({
  useDocument: vi.fn(() => ({ data: null, loading: false })),
  useCollection: vi.fn(() => ({ data: [], loading: false })),
}));

vi.mock('firebase/auth', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getAuth: vi.fn(() => ({})),
    onAuthStateChanged: vi.fn((_auth, callback) => {
      callback(null);
      return () => {};
    }),
  };
});

describe("Rooms Page", () => {
  it("renders room listing", async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Rooms />
        </AuthProvider>
      </BrowserRouter>
    );
    expect(await screen.findByRole('heading', { name: /Our Rooms/i })).toBeInTheDocument();
  });
});