/**
 * Manual tests for authService
 * 
 * Run these tests by importing and calling them in a component
 * or by setting up a proper test runner later.
 */

import { login, logout, type LoginCredentials } from './authService';

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
 * Test 1: Admin role detection
 */
export const testAdminRoleDetection = async () => {
  const credentials: LoginCredentials = {
    mobile: '9999999999',
    pin: '1234',
  };
  
  const response = await login(credentials);
  
  const passed = response.success && response.user?.role === 'ADMIN';
  logTest(
    'Admin role detection',
    passed,
    passed ? 'Admin role correctly assigned' : `Expected ADMIN, got ${response.user?.role}`
  );
  
  return passed;
};

/**
 * Test 2: Cleaner role detection
 */
export const testCleanerRoleDetection = async () => {
  const credentials: LoginCredentials = {
    mobile: '8888888888',
    pin: '1234',
  };
  
  const response = await login(credentials);
  
  const passed = response.success && response.user?.role === 'CLEANER';
  logTest(
    'Cleaner role detection',
    passed,
    passed ? 'Cleaner role correctly assigned' : `Expected CLEANER, got ${response.user?.role}`
  );
  
  return passed;
};

/**
 * Test 3: Customer role detection
 */
export const testCustomerRoleDetection = async () => {
  const credentials: LoginCredentials = {
    mobile: '9876543210',
    pin: '1234',
  };
  
  const response = await login(credentials);
  
  const passed = response.success && response.user?.role === 'CUSTOMER';
  logTest(
    'Customer role detection',
    passed,
    passed ? 'Customer role correctly assigned' : `Expected CUSTOMER, got ${response.user?.role}`
  );
  
  return passed;
};

/**
 * Test 4: Default to customer for other mobile numbers
 */
export const testDefaultCustomerRole = async () => {
  const credentials: LoginCredentials = {
    mobile: '1234567890',
    pin: '1234',
  };
  
  const response = await login(credentials);
  
  const passed = response.success && response.user?.role === 'CUSTOMER';
  logTest(
    'Default customer role',
    passed,
    passed ? 'Other mobile defaults to CUSTOMER' : `Expected CUSTOMER, got ${response.user?.role}`
  );
  
  return passed;
};

/**
 * Test 5: Invalid mobile format
 */
export const testInvalidMobileFormat = async () => {
  const credentials: LoginCredentials = {
    mobile: '123',
    pin: '1234',
  };
  
  const response = await login(credentials);
  
  const passed = !response.success && !!response.error?.includes('10 digits');
  logTest(
    'Invalid mobile format',
    passed,
    passed ? 'Invalid mobile rejected' : 'Should reject invalid mobile format'
  );
  
  return passed;
};

/**
 * Test 6: Invalid PIN format
 */
export const testInvalidPinFormat = async () => {
  const credentials: LoginCredentials = {
    mobile: '9876543210',
    pin: '12',
  };
  
  const response = await login(credentials);
  
  const passed = !response.success && !!response.error?.includes('4-6 digits');
  logTest(
    'Invalid PIN format',
    passed,
    passed ? 'Invalid PIN rejected' : 'Should reject PINs not 4-6 digits'
  );
  
  return passed;
};

/**
 * Test 7: Empty credentials
 */
export const testEmptyCredentials = async () => {
  const credentials: LoginCredentials = {
    mobile: '',
    pin: '',
  };
  
  const response = await login(credentials);
  
  const passed = !response.success && !!response.error?.includes('required');
  logTest(
    'Empty credentials',
    passed,
    passed ? 'Empty credentials rejected' : 'Should reject empty credentials'
  );
  
  return passed;
};

/**
 * Test 8: User object structure
 */
export const testUserObjectStructure = async () => {
  const credentials: LoginCredentials = {
    mobile: '9876543210',
    pin: '1234',
  };
  
  const response = await login(credentials);
  
  const hasRequiredFields = 
    response.success &&
    response.user?.id &&
    response.user?.name &&
    response.user?.mobile &&
    response.user?.role;
  
  logTest(
    'User object structure',
    !!hasRequiredFields,
    hasRequiredFields ? 'User object has all required fields' : 'User object missing required fields'
  );
  
  return !!hasRequiredFields;
};

/**
 * Test 9: Network delay simulation
 */
export const testNetworkDelay = async () => {
  const credentials: LoginCredentials = {
    mobile: '9876543210',
    pin: '1234',
  };
  
  const startTime = Date.now();
  await login(credentials);
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  const passed = duration >= 500 && duration <= 1100; // Allow 100ms buffer
  logTest(
    'Network delay simulation',
    passed,
    passed ? `Delay: ${duration}ms (within 500-1000ms range)` : `Delay: ${duration}ms (expected 500-1000ms)`
  );
  
  return passed;
};

/**
 * Test 10: Logout function
 */
export const testLogout = async () => {
  const startTime = Date.now();
  await logout();
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  const passed = duration >= 500; // Should have network delay
  logTest(
    'Logout function',
    passed,
    passed ? 'Logout completes with simulated delay' : 'Logout should have network delay'
  );
  
  return passed;
};

/**
 * Run all tests
 */
export const runAllTests = async () => {
  console.log('\n=== Running Auth Service Tests ===\n');
  
  const results = await Promise.all([
    testAdminRoleDetection(),
    testCleanerRoleDetection(),
    testCustomerRoleDetection(),
    testDefaultCustomerRole(),
    testInvalidMobileFormat(),
    testInvalidPinFormat(),
    testEmptyCredentials(),
    testUserObjectStructure(),
    testNetworkDelay(),
    testLogout(),
  ]);
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`\n=== Test Results: ${passed}/${total} passed ===\n`);
  
  return passed === total;
};
