import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './contexts/AuthContext';
import { queryClient } from './lib/queryClient';
import { AppRoutes } from './routes';

/**
 * Main App Component
 * 
 * Setup providers hierarchy:
 * 1. BrowserRouter - routing
 * 2. QueryClientProvider - server state management
 * 3. AuthProvider - authentication context
 * 4. AppRoutes - route configuration
 */
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRoutes />
          {/* DevTools - pouze v development */}
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
