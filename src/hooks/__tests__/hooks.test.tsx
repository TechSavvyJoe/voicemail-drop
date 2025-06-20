import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';

// Create a test wrapper with React Query
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
  
  return TestWrapper;
}

describe('React Query Hooks', () => {
  beforeEach(() => {
    // Mock fetch for API calls
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  test('Hook rendering infrastructure works', () => {
    const wrapper = createWrapper();
    
    const { result } = renderHook(
      () => {
        return { test: 'working' };
      },
      { wrapper }
    );
    
    expect(result.current.test).toBe('working');
  });

  test('Fetch is properly mocked', () => {
    expect(global.fetch).toBeDefined();
    expect(typeof global.fetch).toBe('function');
  });
});
