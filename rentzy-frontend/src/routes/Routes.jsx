import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage.jsx';
import LoginSignup from "../pages/LoginSignup";
import Register from "../pages/register";
import TenantHomepage from '../pages/TenantHomepage.jsx';
import GuestHomepage from '../pages/GuestHomepage.jsx';
import OwnerHomepage from '../pages/OwnerHomepage.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      
      <Route path="/" element={<HomePage />} />
      <Route path="/login-signup" element={<LoginSignup />} />
      <Route path="/register" element={<Register />} />
      
    </Routes>
  );
};

export default AppRoutes;
