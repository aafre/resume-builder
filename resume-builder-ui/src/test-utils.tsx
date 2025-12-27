import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthContext } from './contexts/AuthContext';
import { EditorProvider } from './contexts/EditorContext';
import { ConversionProvider } from './contexts/ConversionContext';
import type { User, Session } from '@supabase/supabase-js';

/**
 * Creates a fresh QueryClient instance for each test to prevent state leakage
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries in tests
        gcTime: 0, // Don't cache data between tests (renamed from cacheTime in React Query v5)
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
    logger: {
      log: () => {},
      warn: () => {},
      error: () => {},
    },
  });
}

/**
 * Default mock user for tests
 */
export const createMockUser = (overrides?: Partial<User>): User => ({
  id: 'test-user-id',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'test@example.com',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  user_metadata: {
    full_name: 'Test User',
  },
  app_metadata: {},
  ...overrides,
} as User);

/**
 * Default auth context value for authenticated user
 */
export const createMockAuthContext = (overrides?: any) => ({
  user: createMockUser(),
  session: { user: createMockUser() } as Session,
  loading: false,
  signingOut: false,
  isAuthenticated: true,
  isAnonymous: false,
  hasMigrated: false,
  migrationInProgress: false,
  anonMigrationInProgress: false,
  migratedResumeCount: 0,
  signInWithGoogle: vi.fn(),
  signInWithLinkedIn: vi.fn(),
  signInWithEmail: vi.fn(),
  signOut: vi.fn(),
  ...overrides,
});

/**
 * Default auth context value for anonymous user
 */
export const createMockAnonymousAuthContext = (overrides?: any) => ({
  user: {
    ...createMockUser(),
    is_anonymous: true,
    user_metadata: {},
  },
  session: null,
  loading: false,
  signingOut: false,
  isAuthenticated: false,
  isAnonymous: true,
  hasMigrated: false,
  migrationInProgress: false,
  anonMigrationInProgress: false,
  migratedResumeCount: 0,
  signInWithGoogle: vi.fn(),
  signInWithLinkedIn: vi.fn(),
  signInWithEmail: vi.fn(),
  signOut: vi.fn(),
  ...overrides,
});

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  /**
   * Custom auth context value. If not provided, uses default authenticated user.
   */
  authContext?: any;
  /**
   * Custom QueryClient. If not provided, creates a fresh test client.
   */
  queryClient?: QueryClient;
  /**
   * Whether to wrap with EditorProvider. Default: false.
   */
  withEditorProvider?: boolean;
  /**
   * Initial route for MemoryRouter. Default: '/'.
   */
  initialRoute?: string;
}

/**
 * Renders a component with all required providers for testing.
 *
 * @example
 * ```tsx
 * renderWithProviders(<MyComponent />, {
 *   authContext: createMockAnonymousAuthContext(),
 * });
 * ```
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    authContext = createMockAuthContext(),
    queryClient = createTestQueryClient(),
    withEditorProvider = false,
    initialRoute = '/',
    ...renderOptions
  }: RenderWithProvidersOptions = {}
) {
  function Wrapper({ children }: { children: ReactNode }) {
    // Mock conversion provider functions
    const mockSetIdleNudgeShown = async () => {};

    let content = (
      <MemoryRouter initialEntries={[initialRoute]}>
        <AuthContext.Provider value={authContext}>
          <ConversionProvider
            idleNudgeShown={false}
            setIdleNudgeShown={mockSetIdleNudgeShown}
          >
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </ConversionProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Optionally wrap with EditorProvider
    if (withEditorProvider) {
      content = (
        <MemoryRouter initialEntries={[initialRoute]}>
          <AuthContext.Provider value={authContext}>
            <ConversionProvider
              idleNudgeShown={false}
              setIdleNudgeShown={mockSetIdleNudgeShown}
            >
              <QueryClientProvider client={queryClient}>
                <EditorProvider>
                  {children}
                </EditorProvider>
              </QueryClientProvider>
            </ConversionProvider>
          </AuthContext.Provider>
        </MemoryRouter>
      );
    }

    return content;
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient, // Return queryClient for assertions
  };
}
