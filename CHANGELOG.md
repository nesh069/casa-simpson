
## [1.1.0] - 2026-05-15

### Fixed
- Rooms and menu now fetched from Firestore (not hardcoded)
- Featured rooms section now renders on Home page
- H1 heading now visible in hero section
- Login redirects correctly after authentication
- Phone auth reCAPTCHA fixed
- Delivery address validation with toast error
- ProtectedRoute passes redirect location to Login
- RoomDetail fetches room from Firestore by ID
- Form validation with descriptive error toasts
- Missing toast import in Delivery page fixed

### Added
- Firestore seed utility to auto-populate rooms and menu
- Skeleton loading states on all pages
- Live rating calculation from Firestore reviews on Home page
- 12 rooms total for meaningful filter testing
- 20 menu items across all categories

## [1.1.0] - 2026-05-15

### Fixed
- Rooms and menu now fetched from Firestore (not hardcoded)
- Featured rooms section now renders on Home page
- H1 heading now visible in hero section
- Login redirects correctly after authentication
- Phone auth reCAPTCHA fixed
- Delivery address validation with toast error
- ProtectedRoute passes redirect location to Login
- RoomDetail fetches room from Firestore by ID
- Form validation with descriptive error toasts
- Missing toast import in Delivery page fixed

### Added
- Firestore seed utility to auto-populate rooms and menu
- Skeleton loading states on all pages
- Live rating calculation from Firestore reviews on Home page
- 12 rooms total for meaningful filter testing
- 20 menu items across all categories

## [1.1.0] - 2026-05-16

### Fixed
- All 5 test suites now pass with correct assertions
- Vitest coverage configured with 30% threshold
- Firestore seed now uses original room/menu IDs
- useFirestore handles missing createdAt gracefully
- Removed broken BookingModal component
- RoomDetail fetches room from Firestore by ID
- Delivery page had missing toast import
- Login redirects to intended page after auth
- ProtectedRoute passes location state to Login
- GitHub Actions split into test + deploy jobs

### Added
- BookingConfirmation page with booking reference
- MyBookings page with user-specific Firestore query
- 12 rooms and 20 menu items for full filter coverage
- Skeleton loading states on all data pages
- My Bookings link in Navbar for authenticated users
- Conditional base path (dev vs production)

## [1.1.0] - 2026-05-16

### Fixed
- All 5 test suites now pass with correct assertions
- Vitest coverage configured with 30% threshold
- Firestore seed now uses original room/menu IDs
- useFirestore handles missing createdAt gracefully
- Removed broken BookingModal component
- RoomDetail fetches room from Firestore by ID
- Delivery page had missing toast import
- Login redirects to intended page after auth
- ProtectedRoute passes location state to Login
- GitHub Actions split into test + deploy jobs

### Added
- BookingConfirmation page with booking reference
- MyBookings page with user-specific Firestore query
- 12 rooms and 20 menu items for full filter coverage
- Skeleton loading states on all data pages
- My Bookings link in Navbar for authenticated users
- Conditional base path (dev vs production)
