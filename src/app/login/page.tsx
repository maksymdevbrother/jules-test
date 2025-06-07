import LoginForm from '../../components/auth/LoginForm'; // Adjust path if necessary
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
};

const LoginPage = () => {
  const pageStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 'calc(100vh - 100px)',
    paddingTop: '2rem',
  };

  const headingStyle: React.CSSProperties = {
    marginBottom: '2rem',
    color: '#333',
  };

  return (
    <div style={pageStyle}>
      <h1 style={headingStyle}>Login</h1>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
