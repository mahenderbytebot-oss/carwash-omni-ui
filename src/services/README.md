# Authentication Service

## Overview

The authentication service provides a centralized API for handling user authentication in the carwash PWA. It currently uses a mock implementation that simulates backend API behavior, designed for easy integration with a Spring Boot REST API in the future.

## Features

- **Mock Authentication**: Simulates realistic authentication with network delays (500-1000ms)
- **Role-Based Authentication**: Automatically assigns roles based on email patterns
- **Validation**: Email format and password length validation
- **Error Handling**: Consistent error responses for all failure cases
- **Future-Ready**: Structured for easy Spring Boot API integration

## Usage

### Login

```typescript
import { login } from './services/authService';

const response = await login({
  email: 'admin@example.com',
  password: 'password123'
});

if (response.success && response.user) {
  console.log('Logged in as:', response.user.role);
  // Store user in auth store
} else {
  console.error('Login failed:', response.error);
}
```

### Logout

```typescript
import { logout } from './services/authService';

await logout();
// Clear auth store
```

## Role Detection

The mock implementation assigns roles based on email patterns:

- `admin@*` → **ADMIN** role
- `cleaner@*` → **CLEANER** role  
- `customer@*` or any other → **CUSTOMER** role

Examples:
- `admin@carwash.com` → ADMIN
- `cleaner@carwash.com` → CLEANER
- `john.doe@gmail.com` → CUSTOMER

## Type Definitions

### LoginCredentials
```typescript
interface LoginCredentials {
  email: string;
  password: string;
}
```

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CLEANER' | 'CUSTOMER';
}
```

### LoginResponse
```typescript
interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
}
```

## Validation Rules

### Email
- Required
- Must be valid email format (contains @ and domain)

### Password
- Required
- Minimum 6 characters

## Error Messages

| Scenario | Error Message |
|----------|---------------|
| Empty credentials | "Email and password are required" |
| Invalid email format | "Invalid email format" |
| Short password | "Password must be at least 6 characters" |
| Unexpected error | "An unexpected error occurred. Please try again." |

## Testing

Run the test suite:

```typescript
import { runAllTests } from './services/authService.test';

await runAllTests();
```

Or use the TestRunner component:

```typescript
import { TestRunner } from './services/testRunner';

// In your component
<TestRunner />
```

## Future API Integration

When integrating with the Spring Boot REST API:

1. Update the `login` function to make HTTP requests
2. Add token management (JWT)
3. Update error handling to map API error codes
4. Configure API base URL via environment variables

See comments in `authService.ts` for detailed integration notes.

## Requirements Satisfied

This implementation satisfies the following requirements:

- **1.2**: Authentication request to Backend API (mocked)
- **1.3**: Response includes user role information
- **11.2**: Dedicated service module for authentication
- **11.3**: Mock implementation simulating API responses
- **11.4**: Returns user objects with id, name, email, and role
