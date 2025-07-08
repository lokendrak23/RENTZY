import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage.jsx';
import LoginSignup from "../pages/LoginSignup";
import Register from "../pages/register";
import TenantHomepage from '../pages/TenantHomepage.jsx';
import OwnerHomepage from '../pages/OwnerHomepage.jsx';
import ContactPage from '../pages/ContactPage.jsx';




const AppRoutes = () => {
  return (
    <Routes>
      
      <Route path="/" element={<HomePage />} />
      <Route path="/login-signup" element={<LoginSignup />} />
      <Route path="/register" element={<Register />} />
      <Route path="/tenant-home" element={<TenantHomepage />} />
      <Route path="/owner-home" element={<OwnerHomepage />} />
      <Route path="/contact" element={<ContactPage/>} />
      
    
      
    </Routes>
  );
};

export default AppRoutes;
