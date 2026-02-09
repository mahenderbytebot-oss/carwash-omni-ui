/**
 * Manual tests for authStore
 * 
 * Run these tests by importing and calling them in a component
 * or by setting up a proper test runner later.
 */

import { useAuthStore } from './authStore';
import type { UserRole } from './authStore';

/**
 * Test helper to log results
 */
const logTest = (testName: string, passed: boolean, message?: string) => {
  const status = passed ? '✓' : '✗';
  console.log(`${status} ${testName}`);
  if (message) {
    console.log(`  ${message}`);
  }
};

/**
 * Helper to reset store state
 */
const resetStore = () => {
  const store = useAuthStore.getState();
  store.logout();
  store.clearError();
  store.setLoading(false);
};

/**
 * Test 1: Initial state
 */
export const testInitialState = () => {
  resetStore();
  const state = useAuthStore.getState();
  
  const passed = 
    state.user === null &&
    state.isAuthenticated === false &&
    state.isLoading === false &&
    state.error === null;
  
  logTest(
    'Initial state',
    passed,
    passed ? 'All initial values are correct' : 'Initial state has incorrect values'
  );
  
  return passed;
};

/**
 * Test 2: Set loading to true
 */
export const testSetLoadingTrue = () => {
  resetStore();
  const { setLoading } = useAuthStore.getState();
  
  setLoading(true);
  const passed = useAuthStore.getState().isLoading === true;
  
  logTest(
    'Set loading to true',
    passed,
    passed ? 'Loading state set to true' : 'Failed to set loading to true'
  );
  
  return passed;
};

/**
 * Test 3: Set loading to false
 */
export const testSetLoadingFalse = () => {
  resetStore();
  const { setLoading } = useAuthStore.getState();
  
  setLoading(true);
  setLoading(false);
  const passed = useAuthStore.getState().isLoading === false;
  
  logTest(
    'Set loading to false',
    passed,
    passed ? 'Loading state set to false' : 'Failed to set loading to false'
  );
  
  return passed;
};

/**
 * Test 4: Set error message
 */
export const testSetError = () => {
  resetStore();
  const { setError } = useAuthStore.getState();
  const errorMessage = 'Invalid credentials';
  
  setError(errorMessage);
  const passed = useAuthStore.getState().error === errorMessage;
  
  logTest(
    'Set error message',
    passed,
    passed ? `Error set to: "${errorMessage}"` : 'Failed to set error message'
  );
  
  return passed;
};

/**
 * Test 5: Clear error message
 */
export const testClearError = () => {
  resetStore();
  const { setError, clearError } = useAuthStore.getState();
  
  setError('Some error');
  clearError();
  const passed = useAuthStore.getState().error === null;
  
  logTest(
    'Clear error message',
    passed,
    passed ? 'Error cleared successfully' : 'Failed to clear error'
  );
  
  return passed;
};

/**
 * Test 6: Set error to null directly
 */
export const testSetErrorNull = () => {
  resetStore();
  const { setError } = useAuthStore.getState();
  
  setError('Some error');
  setError(null);
  const passed = useAuthStore.getState().error === null;
  
  logTest(
    'Set error to null directly',
    passed,
    passed ? 'Error set to null successfully' : 'Failed to set error to null'
  );
  
  return passed;
};

/**
 * Test 7: Login sets user and isAuthenticated
 */
export const testLogin = () => {
  resetStore();
  const { login } = useAuthStore.getState();
  const mockUser = {
    id: '1',
    name: 'Test User',
    mobile: '9876543210',
    role: 'CUSTOMER' as UserRole,
  };
  
  login(mockUser, 'dummy-token');
  const state = useAuthStore.getState();
  
  const passed = 
    state.user?.id === mockUser.id &&
    state.user?.name === mockUser.name &&
    state.user?.mobile === mockUser.mobile &&
    state.user?.role === mockUser.role &&
    state.isAuthenticated === true;
  
  logTest(
    'Login sets user and isAuthenticated',
    passed,
    passed ? 'User logged in successfully' : 'Failed to set user on login'
  );
  
  return passed;
};

/**
 * Test 8: Login clears error
 */
export const testLoginClearsError = () => {
  resetStore();
  const { setError, login } = useAuthStore.getState();
  
  setError('Previous error');
  
  const mockUser = {
    id: '1',
    name: 'Test User',
    mobile: '9876543210',
    role: 'ADMIN' as UserRole,
  };
  
  login(mockUser, 'dummy-token');
  const passed = useAuthStore.getState().error === null;
  
  logTest(
    'Login clears error',
    passed,
    passed ? 'Error cleared on login' : 'Error not cleared on login'
  );
  
  return passed;
};

/**
 * Test 9: Logout clears user and isAuthenticated
 */
export const testLogout = () => {
  resetStore();
  const { login, logout } = useAuthStore.getState();
  
  const mockUser = {
    id: '1',
    name: 'Test User',
    mobile: '9876543210',
    role: 'CLEANER' as UserRole,
  };
  
  login(mockUser, 'dummy-token');
  logout();
  
  const state = useAuthStore.getState();
  const passed = state.user === null && state.isAuthenticated === false;
  
  logTest(
    'Logout clears user and isAuthenticated',
    passed,
    passed ? 'User logged out successfully' : 'Failed to clear user on logout'
  );
  
  return passed;
};

/**
 * Test 10: Logout clears error
 */
export const testLogoutClearsError = () => {
  resetStore();
  const { setError, logout } = useAuthStore.getState();
  
  setError('Some error');
  logout();
  
  const passed = useAuthStore.getState().error === null;
  
  logTest(
    'Logout clears error',
    passed,
    passed ? 'Error cleared on logout' : 'Error not cleared on logout'
  );
  
  return passed;
};

/**
 * Test 11: Persistence configuration exists
 */
export const testPersistenceConfiguration = () => {
  const passed = useAuthStore.persist !== undefined;
  
  logTest(
    'Persistence configuration exists',
    passed,
    passed ? 'Store has persistence middleware' : 'Store missing persistence middleware'
  );
  
  return passed;
};

/**
 * Test 12: All roles work with login
 */
export const testAllRoles = () => {
  resetStore();
  const { login } = useAuthStore.getState();
  const roles: UserRole[] = ['ADMIN', 'CLEANER', 'CUSTOMER'];
  
  let allPassed = true;
  
  for (const role of roles) {
    const mockUser = {
      id: `${role}-1`,
      name: `Test ${role}`,
      mobile: '9876543210',
      role,
    };
    
    login(mockUser, 'dummy-token');
    const state = useAuthStore.getState();
    
    if (state.user?.role !== role) {
      allPassed = false;
      break;
    }
  }
  
  logTest(
    'All roles work with login',
    allPassed,
    allPassed ? 'All roles (ADMIN, CLEANER, CUSTOMER) work correctly' : 'Some roles failed'
  );
  
  return allPassed;
};

/**
 * Run all tests
 */
export const runAllAuthStoreTests = () => {
  console.log('\n=== Running Auth Store Tests ===\n');
  
  const results = [
    testInitialState(),
    testSetLoadingTrue(),
    testSetLoadingFalse(),
    testSetError(),
    testClearError(),
    testSetErrorNull(),
    testLogin(),
    testLoginClearsError(),
    testLogout(),
    testLogoutClearsError(),
    testPersistenceConfiguration(),
    testAllRoles(),
  ];
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`\n=== Test Results: ${passed}/${total} passed ===\n`);
  
  return passed === total;
};
