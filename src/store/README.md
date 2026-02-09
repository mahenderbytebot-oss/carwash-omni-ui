# Auth Store

The authentication store manages user authentication state using Zustand with persistence.

## Features

- **User Management**: Store and manage authenticated user information
- **Loading States**: Track authentication operations in progress
- **Error Handling**: Manage and display authentication errors
- **Persistence**: Automatically persist auth state to localStorage
- **Type Safety**: Full TypeScript support with defined interfaces

## State

```typescript
interface AuthState {
  user: User | null;              // Currently authenticated user
  isAuthenticated: boolean;       // Authentication status
  isLoading: boolean;             // Loading state for auth operations
  error: string | null;           // Error message if auth fails
  login: (user: User) => void;    // Login action
  logout: () => void;             // Logout action
  setLoading: (loading: boolean) => void;  // Set loading state
  setError: (error: string | null) => void; // Set error message
  clearError: () => void;         // Clear error message
}
```

## Usage

### Basic Usage

```typescript
import { useAuthStore } from './store/authStore';

function MyComponent() {
  const { user, isAuthenticated, isLoading, error } = useAuthStore();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!isAuthenticated) return <div>Please log in</div>;
  
  return <div>Welcome, {user?.name}!</div>;
}
```

### Login Flow

```typescript
import { useAuthStore } from './store/authStore';
import { login as authServiceLogin } from './services/authService';

function LoginComponent() {
  const { login, setLoading, setError, clearError } = useAuthStore();
  
  const handleLogin = async (email: string, password: string) => {
    clearError();
    setLoading(true);
    
    try {
      const response = await authServiceLogin({ email, password });
      
      if (response.success && response.user) {
        login(response.user);
        // Redirect to dashboard
      } else {
        setError(response.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    // Your login form here
  );
}
```

### Logout

```typescript
import { useAuthStore } from './store/authStore';

function LogoutButton() {
  const { logout } = useAuthStore();
  
  const handleLogout = () => {
    logout();
    // Redirect to login page
  };
  
  return <button onClick={handleLogout}>Logout</button>;
}
```

## Testing

Manual tests are available in `authStore.test.ts`. Run them using the TestRunner component:

```typescript
import { TestRunner } from './services/testRunner';

// In your app
<TestRunner />
```

Or run individual tests:

```typescript
import { runAllAuthStoreTests } from './store/authStore.test';

runAllAuthStoreTests();
```

## Persistence

The auth store automatically persists to localStorage under the key `auth-storage`. This means:

- User remains logged in after page refresh
- Authentication state survives browser restarts
- Logout clears the persisted data

## Requirements Satisfied

This implementation satisfies the following requirements from the unified-login-modern-ui spec:

- **Requirement 1.4**: Store user role information in Auth_Store
- **Requirement 10.1**: Persist authentication state to local storage

## Related Files

- `src/services/authService.ts` - Authentication service with mock API
- `src/store/authStore.test.ts` - Manual tests for the auth store
- `src/services/testRunner.tsx` - Test runner component
