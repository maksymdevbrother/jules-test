'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../../lib/auth'; // Adjust path if necessary
import { useRouter } from 'next/navigation';
import type { Metadata } from 'next'; // Next.js recommends not exporting metadata from client components

// It's generally better to set metadata in a server component or layout if the page itself is client-rendered
// For this example, we'll manage title via a traditional <title> tag or skip if not critical
// export const metadata: Metadata = {
// title: 'Protected Page',
// };

const ProtectedPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Styling for the page
  const pageStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '2rem',
    textAlign: 'center',
  };

  const headingStyle: React.CSSProperties = {
    fontSize: '2rem',
    marginBottom: '1rem',
  };

  const textStyle: React.CSSProperties = {
    fontSize: '1.1rem',
    lineHeight: '1.6',
  };


  if (isLoading) {
    return (
        <div style={pageStyle}>
            <p>Loading...</p>
        </div>
    );
  }

  if (!isAuthenticated) {
    // This will be briefly shown before useEffect redirects, or if redirection is slow.
    // Or, you can return null or a more specific "Redirecting..." message.
    return (
        <div style={pageStyle}>
            <p>Redirecting to login...</p>
        </div>
    );
  }

  return (
    <div style={pageStyle}>
      <title>Protected Page</title> {/* Simple way to set title for client component */}
      <h1 style={headingStyle}>Protected Content</h1>
      {user ? (
        <p style={textStyle}>Welcome to the protected page, {user.username}!</p>
      ) : (
        <p style={textStyle}>You have access to this protected content.</p>
      )}
      {/* Add more protected content here */}
    </div>
  );
};

export default ProtectedPage;
