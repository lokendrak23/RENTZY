import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

// Import the specific homepages
import GuestHomepage from './GuestHomepage.jsx';
import TenantHomepage from './TenantHomepage.jsx';
import OwnerHomepage from './OwnerHomepage.jsx';

const HomePage = () => {
  const { user, isAuthenticated, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // If no user is logged in, show the guest page
  if (!isAuthenticated || !user) {
    return <GuestHomepage />;
  }

  // Check the user's role and render the correct component
  switch (user.role) {
    case 'tenant':
      return <TenantHomepage />;
    case 'homeowner':
      return <OwnerHomepage />;
    default:
      // A fallback in case the role is something else
      return <GuestHomepage />;
  }
};

export default HomePage;
