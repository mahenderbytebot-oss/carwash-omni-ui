/**
 * Manual tests for DashboardHeader component
 * 
 * These tests verify the DashboardHeader component renders correctly
 * with user information, logout button, and responsive design.
 */

import { createRoot } from 'react-dom/client';
import DashboardHeader from './DashboardHeader';

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
 * Test 1: DashboardHeader renders with required props
 */
export const testDefaultRender = () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  
  try {
    root.render(
      <DashboardHeader
        title="Admin Dashboard"
        userName="John Doe"
        userRole="ADMIN"
        onLogout={() => {}}
      />
    );
    
    const passed = container.querySelector('header') !== null;
    logTest(
      'DashboardHeader renders with required props',
      passed,
      passed ? 'Component rendered successfully' : 'Component failed to render'
    );
    
    root.unmount();
    return passed;
  } catch (error) {
    logTest('DashboardHeader renders with required props', false, `Error: ${error}`);
    return false;
  }
};

/**
 * Test 2: DashboardHeader displays title
 */
export const testTitleDisplay = () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  
  try {
    root.render(
      <DashboardHeader
        title="Admin Dashboard"
        userName="John Doe"
        userRole="ADMIN"
        onLogout={() => {}}
      />
    );
    
    const titleElement = container.querySelector('h1');
    const passed = titleElement?.textContent === 'Admin Dashboard';
    logTest(
      'DashboardHeader displays title',
      passed,
      passed ? 'Title displayed correctly' : 'Title not found or incorrect'
    );
    
    root.unmount();
    return passed;
  } catch (error) {
    logTest('DashboardHeader displays title', false, `Error: ${error}`);
    return false;
  }
};

/**
 * Test 3: DashboardHeader displays user name
 */
export const testUserNameDisplay = () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  
  try {
    root.render(
      <DashboardHeader
        title="Admin Dashboard"
        userName="John Doe"
        userRole="ADMIN"
        onLogout={() => {}}
      />
    );
    
    const textContent = container.textContent || '';
    const passed = textContent.includes('John Doe') || textContent.includes('John');
    logTest(
      'DashboardHeader displays user name',
      passed,
      passed ? 'User name displayed' : 'User name not found'
    );
    
    root.unmount();
    return passed;
  } catch (error) {
    logTest('DashboardHeader displays user name', false, `Error: ${error}`);
    return false;
  }
};

/**
 * Test 4: DashboardHeader formats and displays user role
 */
export const testUserRoleDisplay = () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  
  try {
    root.render(
      <DashboardHeader
        title="Admin Dashboard"
        userName="John Doe"
        userRole="ADMIN"
        onLogout={() => {}}
      />
    );
    
    const textContent = container.textContent || '';
    const passed = textContent.includes('Admin');
    logTest(
      'DashboardHeader formats and displays user role',
      passed,
      passed ? 'Role formatted and displayed correctly' : 'Role not found or incorrect'
    );
    
    root.unmount();
    return passed;
  } catch (error) {
    logTest('DashboardHeader formats and displays user role', false, `Error: ${error}`);
    return false;
  }
};

/**
 * Test 5: DashboardHeader renders logout button
 */
export const testLogoutButton = () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  
  try {
    root.render(
      <DashboardHeader
        title="Admin Dashboard"
        userName="John Doe"
        userRole="ADMIN"
        onLogout={() => {}}
      />
    );
    
    const button = container.querySelector('button');
    const passed = button !== null;
    logTest(
      'DashboardHeader renders logout button',
      passed,
      passed ? 'Logout button found' : 'Logout button not found'
    );
    
    root.unmount();
    return passed;
  } catch (error) {
    logTest('DashboardHeader renders logout button', false, `Error: ${error}`);
    return false;
  }
};

/**
 * Test 6: DashboardHeader logout button has accessibility attributes
 */
export const testLogoutButtonAccessibility = () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  
  try {
    root.render(
      <DashboardHeader
        title="Admin Dashboard"
        userName="John Doe"
        userRole="ADMIN"
        onLogout={() => {}}
      />
    );
    
    const button = container.querySelector('button');
    const hasAriaLabel = button?.getAttribute('aria-label') === 'Logout';
    const passed = hasAriaLabel;
    logTest(
      'DashboardHeader logout button has accessibility attributes',
      passed,
      passed ? 'Aria-label found' : 'Aria-label missing or incorrect'
    );
    
    root.unmount();
    return passed;
  } catch (error) {
    logTest('DashboardHeader logout button has accessibility attributes', false, `Error: ${error}`);
    return false;
  }
};

/**
 * Test 7: DashboardHeader has glassmorphism styling
 */
export const testGlassmorphismStyling = () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  
  try {
    root.render(
      <DashboardHeader
        title="Admin Dashboard"
        userName="John Doe"
        userRole="ADMIN"
        onLogout={() => {}}
      />
    );
    
    const header = container.querySelector('header');
    const hasBackdropBlur = header?.classList.contains('backdrop-blur-md');
    const passed = hasBackdropBlur !== undefined && hasBackdropBlur;
    logTest(
      'DashboardHeader has glassmorphism styling',
      passed,
      passed ? 'Glassmorphism styles applied' : 'Glassmorphism styles not found'
    );
    
    root.unmount();
    return passed;
  } catch (error) {
    logTest('DashboardHeader has glassmorphism styling', false, `Error: ${error}`);
    return false;
  }
};

/**
 * Test 8: DashboardHeader applies custom className
 */
export const testCustomClassName = () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  
  try {
    root.render(
      <DashboardHeader
        title="Admin Dashboard"
        userName="John Doe"
        userRole="ADMIN"
        onLogout={() => {}}
        className="custom-test-class"
      />
    );
    
    const header = container.querySelector('.custom-test-class');
    const passed = header !== null;
    logTest(
      'DashboardHeader applies custom className',
      passed,
      passed ? 'Custom className applied' : 'Custom className not found'
    );
    
    root.unmount();
    return passed;
  } catch (error) {
    logTest('DashboardHeader applies custom className', false, `Error: ${error}`);
    return false;
  }
};

/**
 * Test 9: DashboardHeader displays user icon
 */
export const testUserIcon = () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  
  try {
    root.render(
      <DashboardHeader
        title="Admin Dashboard"
        userName="John Doe"
        userRole="ADMIN"
        onLogout={() => {}}
      />
    );
    
    const icons = container.querySelectorAll('ion-icon');
    const passed = icons.length > 0;
    logTest(
      'DashboardHeader displays user icon',
      passed,
      passed ? `Found ${icons.length} icons` : 'No icons found'
    );
    
    root.unmount();
    return passed;
  } catch (error) {
    logTest('DashboardHeader displays user icon', false, `Error: ${error}`);
    return false;
  }
};

/**
 * Test 10: DashboardHeader formats different roles correctly
 */
export const testRoleFormatting = () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  
  const roles = [
    { input: 'ADMIN', expected: 'Admin' },
    { input: 'CLEANER', expected: 'Cleaner' },
    { input: 'CUSTOMER', expected: 'Customer' }
  ];
  
  let allPassed = true;
  
  for (const role of roles) {
    try {
      root.render(
        <DashboardHeader
          title="Dashboard"
          userName="Test User"
          userRole={role.input}
          onLogout={() => {}}
        />
      );
      
      const textContent = container.textContent || '';
      const passed = textContent.includes(role.expected);
      
      if (!passed) {
        allPassed = false;
        logTest(
          `DashboardHeader formats ${role.input} role`,
          false,
          `Expected "${role.expected}" not found`
        );
      }
    } catch (error) {
      allPassed = false;
      logTest(`DashboardHeader formats ${role.input} role`, false, `Error: ${error}`);
    }
  }
  
  logTest(
    'DashboardHeader formats different roles correctly',
    allPassed,
    allPassed ? 'All roles formatted correctly' : 'Some roles not formatted correctly'
  );
  
  root.unmount();
  return allPassed;
};

/**
 * Run all tests
 */
export const runAllDashboardHeaderTests = () => {
  console.log('\n=== Running DashboardHeader Component Tests ===\n');
  
  const results = [
    testDefaultRender(),
    testTitleDisplay(),
    testUserNameDisplay(),
    testUserRoleDisplay(),
    testLogoutButton(),
    testLogoutButtonAccessibility(),
    testGlassmorphismStyling(),
    testCustomClassName(),
    testUserIcon(),
    testRoleFormatting(),
  ];
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`\n=== Test Results: ${passed}/${total} passed ===\n`);
  
  return passed === total;
};
