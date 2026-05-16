# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Casa Simpson

A modern, fully responsive hospitality web application built with **React 19**, **Vite**, **Firebase**, and **Tailwind CSS v4**. Casa Simpson offers luxury room bookings, fine dining, food delivery, and guest reviews — all backed by real-time data persistence via Firebase Firestore.

---

## Live Demo

🔗 [https://nesh069.github.io/casa-simpson/](https://nesh069.github.io/casa-simpson/)

---

## Features

| Feature | Description |
|---------|-------------|
| 🏨 **Luxury Rooms** | Browse and book curated rooms and suites |
| 🍽️ **Fine Dining** | Restaurant menu with world-class cuisine |
| 🚚 **Food Delivery** | Order food delivered to your location |
| ⭐ **Guest Reviews** | Read and submit verified reviews |
| 🔐 **Authentication** | Email, Google, GitHub, and Phone OTP login |
| 📱 **Responsive** | Fully responsive across mobile, tablet, and desktop |
| ⚡ **Real-time** | Live data via Firebase Firestore |
| 🧪 **Tested** | Vitest + React Testing Library with coverage |

---

## Tech Stack

- **Frontend:** React 19, React Router DOM v7, Tailwind CSS v4
- **Build Tool:** Vite 6
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Payments:** Flutterwave React v3
- **Maps:** Google Maps API, React Google Maps
- **Testing:** Vitest, React Testing Library, jsdom
- **CI/CD:** GitHub Actions → GitHub Pages

---

## Project Structure

```

├── 📜 CHANGELOG.md
├── 📜 README.md
├── 🟨 eslint.config.js
├── 📄 index.html
├── 🗂️ package-lock.json
├── 🗂️ package.json
├── 📁 public
│ ├── 🖼️ favicon.svg
│ ├── 🖼️ icons.svg
├── 📁 src
│ ├── 🟦 App.jsx
│ ├── 📜 CHANGELOG.md
│ ├── 📁 components
│ │ ├── 🟦 CartDrawer.jsx
│ │ ├── 🟦 DeliveryTracker.jsx
│ │ ├── 🟦 Footer.jsx
│ │ ├── 🟦 MenuCard.jsx
│ │ ├── 🟦 Navbar.jsx
│ │ ├── 🟦 PaymentModal.jsx
│ │ ├── 🟦 ProtectedRoute.jsx
│ │ ├── 🟦 ReviewCard.jsx
│ │ ├── 🟦 RoomCard.jsx
│ │ ├── 🟦 StarRating.jsx
│ ├── 📁 context
│ │ ├── 🟦 AuthContext.jsx
│ │ ├── 🟦 CartContext.jsx
│ ├── 📁 data
│ │ ├── 🟨 menu.js
│ │ ├── 🟨 reviews.js
│ │ ├── 🟨 rooms.js
│ ├── 🟨 firebase.js
│ ├── 📁 hooks
│ │ ├── 🟨 useFirestore.js
│ ├── 🎨 index.css
│ ├── 🟦 main.jsx
│ ├── 📁 pages
│ │ ├── 🟦 BookingConfirmation.jsx
│ │ ├── 🟦 Delivery.jsx
│ │ ├── 🟦 Home.jsx
│ │ ├── 🟦 Login.jsx
│ │ ├── 🟦 MyBookings.jsx
│ │ ├── 🟦 NotFound.jsx
│ │ ├── 🟦 Restaurant.jsx
│ │ ├── 🟦 Reviews.jsx
│ │ ├── 🟦 RoomDetail.jsx
│ │ ├── 🟦 Rooms.jsx
│ ├── 📁 tests
│ │ ├── 🟦 AuthContext.test.jsx
│ │ ├── 🟦 CartContext.test.jsx
│ │ ├── 🟦 Home.test.jsx
│ │ ├── 🟦 MenuCard.test.jsx
│ │ ├── 🟦 Navbar.test.jsx
│ │ ├── 🟦 ProtectedRoute.test.jsx
│ │ ├── 🟦 RoomCard.test.jsx
│ │ ├── 🟦 Rooms.test.jsx
│ │ ├── 📁 __mocks__
│ │ │ ├── 🟨 firebase.js
│ │ ├── 🟦 setup.jsx
│ ├── 📁 utils
│ │ ├── 🟨 helpers.js
│ │ ├── 🟨 seedFirestore.js
├── 🟨 vite.config.js

```


---

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Firebase project (for Auth and Firestore)
- Flutterwave account (for payments)
- Google Maps API key (for delivery address autocomplete)

### Installation

```bash
# Clone the repository
git clone https://github.com/nesh069/casa-simpson.git
cd casa-simpson

# Install dependencies
npm install

# Create environment variables
cp .env.example .env
# Edit .env with your Firebase and API keys

```

---

## Development

```bash
# Start the dev server
npm run dev

# Run tests
npm run test:run

# Run tests with coverage
npm run coverage

# Build for production
npm run build

# Preview production build
npm run preview

```

## Authentication

| Method           | Status |
| ---------------- | ------ |
| Email & Password | ✅      |
| Google OAuth     | ✅      |
| GitHub OAuth     | ✅      |
| Phone OTP        | ✅      |

---

## Deployment

The application is automatically deployed to GitHub Pages via GitHub Actions:

1. Push to main branch
2. GitHub Actions runs tests
3. On success, builds and deploys to GitHub Pages

---

## Manual Deployment

```bash

Copy
# Build the project
npm run build

# The dist/ folder is ready for deployment
# For GitHub Pages, ensure 404.html is copied from index.html
```

---

## Testing

Tests are written with Vitest and React Testing Library:

```bash
Copy
# Run all tests
npm run test:run

# Run with UI
npm run test

# Generate coverage report
npm run coverage
```

---

## Test Files

| File                      | Coverage                       |
| ------------------------- | ------------------------------ |
| `AuthContext.test.jsx`    | Auth state management          |
| `CartContext.test.jsx`    | Cart operations                |
| `Home.test.jsx`           | Hero, features, rooms, reviews |
| `MenuCard.test.jsx`       | Menu item rendering            |
| `Navbar.test.jsx`         | Navigation links               |
| `ProtectedRoute.test.jsx` | Route guards                   |
| `RoomCard.test.jsx`       | Room card display              |
| `Rooms.test.jsx`          | Rooms page                     |

---

## Data Persistence

All application data is persisted via Firebase Firestore — no localStorage or browser caching is used:

-Rooms — seeded from src/data/rooms.js

-Menu — seeded from src/data/menu.js

-Reviews — user-submitted with real-time updates

-Bookings — stored per authenticated user

-Cart — React state only (clears on refresh)

---

## Seeding Data

Data is automatically seeded on first load via seedFirestore.js:
```bash
import { seedRooms, seedMenu } from './utils/seedFirestore'

// Called in App.jsx useEffect
seedRooms()
seedMenu()
```

---

## Responsive Design

The application is fully responsive using Tailwind CSS v4:

Mobile — Single column layouts, hamburger menu

Tablet — 2-column grids, expanded navigation

Desktop — Full 3-4 column layouts, sticky sidebars

---

## Versioning

This project follows Semantic Versioning:

-v1.3.0 — Current stable release

-See GitHub Releases for changelog

---

## License

MIT License — feel free to use, modify, and distribute.

---


## Author

Emmanuel Munene — GitHub

---

## Acknowledgments

React — UI library

Vite — Build tool

Tailwind CSS — Styling

Firebase — Backend services

Flutterwave — Payment processing
