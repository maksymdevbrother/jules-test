'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as jose from 'jose';

export interface User {
  id: number;
  username: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'your-secret-key-here';
// Note: Exposing JWT_SECRET to the client like this (via NEXT_PUBLIC_) is generally not recommended
// if the secret is highly sensitive and used for signing tokens on the server.
// For verifying tokens received from the server, it might be acceptable, but ideally,
// verification should happen server-side or via an API call.
// Here, we'll primarily use it for decoding on the client for display purposes if needed,
// but actual auth status relies on the /api/auth/me endpoint.

const secret = new TextEncoder().encode(JWT_SECRET);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = async (newToken: string) => {
    try {
      const { payload } = await jose.jwtVerify(newToken, secret)  as { payload: jose.JWTPayload & User };
      setUser({ id: payload.userId as number, username: payload.username as string });
      setToken(newToken);
      setIsAuthenticated(true);
      // No need to set cookie here, login API already does it.
    } catch (error) {
      console.error('Failed to decode token on login:', error);
      // If token is invalid, logout
      await logout();
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Error calling logout API:', error);
    } finally {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      // Cookie is cleared by the API route
    }
  };

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        if (data.user && data.token) {
          setUser(data.user);
          setToken(data.token); // Store the token if the server sends it back
          setIsAuthenticated(true);
        } else {
          // This case might happen if /api/auth/me doesn't return a token
          // but confirms auth. Or if it returns user but no token.
          // Depending on desired logic, you might only set user and isAuthenticated.
          // For now, if token is missing from /me response, treat as not fully logged in.
          await logout(); // Clears local state
        }
      } else {
        await logout(); // Clears local state
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      await logout(); // Clears local state
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
