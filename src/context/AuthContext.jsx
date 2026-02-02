import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('aurora_auth_token');
        const userData = localStorage.getItem('aurora_user_data');

        if (token && userData) {
          // Validate token (in real app, this would be an API call)
          const isValid = await validateToken(token);

          if (isValid) {
            setUser(JSON.parse(userData));
            setIsAuthenticated(true);
          } else {
            clearAuthData();
          }
        } else {
          clearAuthData();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Mock token validation (replace with real API call)
  const validateToken = async (token) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // In production, you would:
    // 1. Validate token structure
    // 2. Check expiration
    // 3. Verify with backend
    return token.startsWith('aurora_');
  };

  // Clear all auth data
  const clearAuthData = () => {
    localStorage.removeItem('aurora_auth_token');
    localStorage.removeItem('aurora_user_data');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Login function
  const login = async (username, password) => {
    setLoading(true);

    try {
      // Mock API call (replace with real authentication)
      await new Promise(resolve => setTimeout(resolve, 800));

      // In production, you would:
      // 1. Call your auth API
      // 2. Get token and user data
      // 3. Store securely

      // Mock validation
      if (username === 'admin' && password === 'admin123') {
        const mockToken = 'aurora_jwt_' + Date.now();
        const mockUser = {
          id: 'admin_001',
          username: 'admin',
          name: 'Administrator',
          email: 'admin@aurora.com',
          role: 'administrator',
          lastLogin: new Date().toISOString(),
          permissions: ['read', 'write', 'manage']
        };

        // Store auth data
        localStorage.setItem('aurora_auth_token', mockToken);
        localStorage.setItem('aurora_user_data', JSON.stringify(mockUser));

        // Update state
        setUser(mockUser);
        setIsAuthenticated(true);

        return { success: true, user: mockUser };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        error: error.message || 'Authentication failed'
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    clearAuthData();
    setIsAuthenticated(false);

    // Optional: Clear any other related data
    localStorage.removeItem('aurora_settings');

    return { success: true };
  };

  // Check if user has permission
  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  // Update user data
  const updateUser = (updates) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('aurora_user_data', JSON.stringify(updatedUser));
    return updatedUser;
  };

  // Refresh user data (e.g., after profile update)
  const refreshUser = async () => {
    const token = localStorage.getItem('aurora_auth_token');
    if (!token) return;

    try {
      // Mock API call to refresh user data
      await new Promise(resolve => setTimeout(resolve, 300));

      const userData = localStorage.getItem('aurora_user_data');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    hasPermission,
    refreshUser,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

// Higher Order Component for protected routes
export const withAuth = (Component) => {
  return function WithAuthComponent(props) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#0f1117'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid rgba(255, 255, 255, 0.1)',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <div style={{
            marginTop: '1.5rem',
            color: '#94a3b8',
            fontSize: '0.95rem'
          }}>
            Verifying authentication...
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null; // Will be redirected by App.js
    }

    return <Component {...props} />;
  };
};

export default AuthContext;
