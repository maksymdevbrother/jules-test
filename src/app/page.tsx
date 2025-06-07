'use client';

import Link from 'next/link';
import { useAuth } from '../lib/auth'; // Adjust path if necessary
import Image from 'next/image'; // Keep for existing content if desired

export default function Home() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  // Basic styling for layout and elements
  const pageContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '2rem',
    fontFamily: 'var(--font-geist-sans)',
    textAlign: 'center',
  };

  const contentStyle: React.CSSProperties = {
    maxWidth: '600px',
  };

  const headingStyle: React.CSSProperties = {
    fontSize: '2rem',
    marginBottom: '1rem',
  };

  const textStyle: React.CSSProperties = {
    fontSize: '1.1rem',
    marginBottom: '1.5rem',
    lineHeight: '1.6',
  };

  const linkStyle: React.CSSProperties = {
    margin: '0 0.5rem',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.375rem',
    textDecoration: 'none',
    backgroundColor: '#0070f3',
    color: 'white',
    fontWeight: 500,
    transition: 'background-color 0.2s',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#dc3545', // A common red for logout
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginTop: '1rem',
  };

  if (isLoading) {
    return (
      <div style={pageContainerStyle}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={pageContainerStyle}>
      <main style={contentStyle}>
        {isAuthenticated && user ? (
          <>
            <h1 style={headingStyle}>Welcome, {user.username}!</h1>
            <p style={textStyle}>
              You are successfully logged in. You can now access protected parts of this application.
            </p>
            <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
              <Link href="/protected" style={{...linkStyle, backgroundColor: '#28a745' }}> {/* Green for contrast */}
                Go to Protected Page
              </Link>
            </div>
            <button onClick={logout} style={buttonStyle}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={180}
              height={38}
              priority
              style={{ margin: '0 auto 2rem auto' }}
            />
            <h1 style={headingStyle}>Welcome to the Next.js Auth Example</h1>
            <p style={textStyle}>
              This is a simple application demonstrating user authentication using Next.js App Router,
              HttpOnly cookies, and React Context. Please login or register to continue.
            </p>
            <div>
              <Link href="/login" style={linkStyle}>
                Login
              </Link>
              <Link href="/register" style={linkStyle}>
                Register
              </Link>
            </div>
            {/* You can keep or remove the Vercel/Next.js links below */}
            <div style={{ marginTop: '3rem', borderTop: '1px solid #eaeaea', paddingTop: '2rem' }}>
              <a
                href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...linkStyle, backgroundColor: '#000', marginRight: '1rem' }}
              >
                Deploy now
              </a>
              <a
                href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...linkStyle, backgroundColor: '#333' }}
              >
                Read Next.js Docs
              </a>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
