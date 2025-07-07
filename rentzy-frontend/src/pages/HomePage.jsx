import React from 'react';
import { useAuth } from '../context/AuthContext.jsx'; // Adjust path if needed

// Import the specific homepages
import GuestHomepage from './GuestHomepage.jsx';
import TenantHomepage from './TenantHomepage.jsx';
import OwnerHomepage from './OwnerHomepage.jsx';

const HomePage = () => {
  const { user } = useAuth(); // Get user state from context

  if (!user) {
    // If no user is logged in, show the guest page
    return <GuestHomepage />;
  }

  // Check the user's role and render the correct component
  switch (user.role) {
    case 'tenant':
      return <TenantHomepage />;
    case 'home_owner':
      return <OwnerHomepage />;
    default:
      // A fallback in case the role is something else
      return <GuestHomepage />;
  }
};

export default HomePage;
