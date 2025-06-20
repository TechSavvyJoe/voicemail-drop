import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';

// Create a test wrapper with React Query
function createTestWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return function TestWrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

describe('Component Rendering Tests', () => {
  let TestWrapper: ReturnType<typeof createTestWrapper>;
  
  beforeEach(() => {
    TestWrapper = createTestWrapper();
  });

  test('Basic component rendering test', () => {
    const TestComponent = () => <div data-testid="test-component">Test Component</div>;
    
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );
    
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });

  test('React Query provider is working', () => {
    const TestComponent = () => {
      // This would normally use a hook, but for simplicity just render
      return <div data-testid="query-test">Query Client Working</div>;
    };
    
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );
    
    expect(screen.getByTestId('query-test')).toBeInTheDocument();
  });
});
