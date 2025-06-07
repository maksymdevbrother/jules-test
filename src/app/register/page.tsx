import RegisterForm from '../../components/auth/RegisterForm'; // Adjust path if necessary
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register',
};

const RegisterPage = () => {
  const pageStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align form to the top, let form margin handle spacing
    minHeight: 'calc(100vh - 100px)', // Adjust 100px based on header/footer height
    paddingTop: '2rem', // Add some padding at the top
  };

  const headingStyle: React.CSSProperties = {
    marginBottom: '2rem', // Space between heading and form
    color: '#333', // Example color
  };

  return (
    <div style={pageStyle}>
      {/* You can add a global header/navbar outside this specific page component */}
      <h1 style={headingStyle}>Register</h1>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
