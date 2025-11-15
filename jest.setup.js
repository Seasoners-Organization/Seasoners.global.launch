import '@testing-library/jest-dom';

// Provide a light mock for next-auth hooks used in components during tests.
// Tests can override this mock if they need to emulate an authenticated session.
jest.mock('next-auth/react', () => ({
	useSession: () => ({ data: null, status: 'unauthenticated' }),
	signIn: async () => {},
	signOut: async () => {}
}));