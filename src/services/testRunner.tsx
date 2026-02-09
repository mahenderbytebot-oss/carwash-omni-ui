/**
 * Test Runner Component
 * 
 * Temporary component to run manual tests for authService, authStore, and UI components
 * Can be imported and used in the app to verify functionality
 */

import { useState } from 'react';
import { runAllTests } from './authService.test';
import { runAllAuthStoreTests } from '../store/authStore.test';

export const TestRunner = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<string>('');

  const handleRunTests = async () => {
    setIsRunning(true);
    setResults('Running tests...\n');
    
    // Capture console.log output
    const originalLog = console.log;
    const logs: string[] = [];
    
    console.log = (...args) => {
      const message = args.join(' ');
      logs.push(message);
      originalLog(...args);
    };
    
    try {
      await runAllTests();
      runAllAuthStoreTests();
      runAllAuthStoreTests();
      setResults(logs.join('\n'));
    } catch (error) {
      setResults(`Error running tests: ${error}`);
    } finally {
      console.log = originalLog;
      setIsRunning(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Test Runner</h2>
      <p style={{ color: '#666', marginBottom: '15px' }}>
        Runs tests for Auth Service, Auth Store, and UI Components
      </p>
      <button 
        onClick={handleRunTests} 
        disabled={isRunning}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: isRunning ? 'not-allowed' : 'pointer',
          backgroundColor: isRunning ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        {isRunning ? 'Running Tests...' : 'Run Tests'}
      </button>
      
      {results && (
        <pre style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          whiteSpace: 'pre-wrap',
          fontSize: '14px',
        }}>
          {results}
        </pre>
      )}
    </div>
  );
};
