import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

const TestComponent = () => {
  const { user, login, logout } = useAuth();
  
  return (
    <div>
      {user ? (
        <>
          <div>Logged in as: {user.email}</div>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login('test@example.com', 'password')}>
          Login
        </button>
      )}
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides authentication state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByText(/Login/)).toBeInTheDocument();
  });

  it('handles login successfully', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    fireEvent.click(screen.getByText(/Login/));
    
    await waitFor(() => {
      expect(screen.getByText(/Logged in as: test@example.com/)).toBeInTheDocument();
    });
  });

  it('handles logout', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // First login
    fireEvent.click(screen.getByText(/Login/));
    await waitFor(() => {
      expect(screen.getByText(/Logged in as/)).toBeInTheDocument();
    });
    
    // Then logout
    fireEvent.click(screen.getByText(/Logout/));
    expect(screen.getByText(/Login/)).toBeInTheDocument();
  });

  it('persists user session', () => {
    const mockUser = {
      id: 'test_id',
      email: 'test@example.com',
      name: 'Test User'
    };
    localStorage.setItem('pollwave_user', JSON.stringify(mockUser));
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByText(/Logged in as: test@example.com/)).toBeInTheDocument();
  });
});