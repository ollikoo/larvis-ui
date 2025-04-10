# LARVIS UI

LARVIS UI is a React/TypeScript frontend application built with Vite, Ant Design, and TanStack Router. It provides a user-friendly interface for managing data, featuring a login system, dashboard, and user profiles.

## Prerequisites for running the App

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher
- **Backend Server**: The Larvis API server must be running (assumed to be at `http://localhost:8000`).

### Installation

1. **Run application**:

#### Build the Docker image for Larvis API:

```bash
docker build -t larvis-service .
```

2. **Install dependencies**:

```bash
npm i
```

#### Run the image:

```bash
docker run -p 8080:8080 larvis-service
```

#### Run the app in dev mode:

```bash
npm run dev
```

The app will be available at http://localhost:5173 (The Larvis API is assumed to be at `http://localhost:8080`)

#### Serve the production build locally

```bash
npm run build
```

```bash
npm run serve
```

The app will be available at http://localhost:8081 (The Larvis API is assumed to be at `http://localhost:8080`)

## Improvements

### Test coverage

Due to time constraints I had only time to cover the login view. Ideally the application should have high test coverage and E2E tests could be considered too.

- Add unit tests for the dashboard (e.g., data fetching, histogram rendering, trend calculations).
- Test user profile components for data display and updates.
- Introduce End-to-End tests using Playwright to simulate user flows (e.g., login -> dashboard -> logout).
- Aim for at least 80% test coverage, focusing on critical paths

### Secure password handling

The API sends the user's password to the client which is a severe security risk. Passwords should never be exposed to client (even if hashed) as it could lead unauthorized access if the request is intercepted. Passwords should be securely hashed when stored using some strong algorithm like `bcrypt`.

#### Proper authentication

The backend does seem to send the same token for all users, which indicates a lack of proper authentication. This poses a security risk as it allows unauthorized access and doesn’t differentiate between users.

- Implement a proper JWT authentication system:
  - Generate a unique JWT token for each user upon successful login, signed with a secret key. Include user-specific claims (e.g., `user_id`, `username`) in the token payload.
  - Set an expiration time for the token (e.g., 15 minutes) to limit its validity.
  - Add support for refresh tokens.
  - Use HttpOnly, Secure, and SameSite cookies to store the token securely, preventing XSS attacks (better than sessionStorage used currently in the frontend).

#### Error Handling

- Return more specific error messages (e.g., "Invalid credentials" for 401 errors) to improve user feedback.

#### Pagination

- Add pagination and timeframe filter support for the `/acquisitions` endpoint to handle large datasets efficiently.

#### Validation

- Implement stricter input validation (e.g., `username` and `password` length) and return detailed validation errors.

#### Documentation

- Provide an OpenAPI/Swagger specification for the API to improve frontend-backend integration and testing.

### Accessibility

Ant Design's default accessibility support seems to be limited, and the colors used in the app do not meet accessibility standards (e.g., low contrast ratios). Due to time constraints, these issues could not be fully addressed.

### Localization

The application does not have any tool for localization due to time constraints but it would be beneficial to have it from the get go.
