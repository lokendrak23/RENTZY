import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import logoImage from '../assets/lavi.svg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  // Guest Navbar (for unauthenticated users)
  const GuestNavbar = () => (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" onClick={closeMobileMenu} className="flex items-center space-x-3 group">
              <img 
                src={logoImage} 
                alt="Rentzy Logo" 
                className="h-12 w-auto transition-transform duration-300 group-hover:scale-105" 
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              <Link 
                to="/" 
                className={`text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 relative group ${
                  location.pathname === '/' ? 'text-emerald-600 bg-emerald-50' : ''
                }`}
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                to="/properties" 
                className={`text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 relative group ${
                  location.pathname === '/properties' ? 'text-emerald-600 bg-emerald-50' : ''
                }`}
              >
                Properties
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                to="/about" 
                className={`text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 relative group ${
                  location.pathname === '/about' ? 'text-emerald-600 bg-emerald-50' : ''
                }`}
              >
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                to="/contact" 
                className={`text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 relative group ${
                  location.pathname === '/contact' ? 'text-emerald-600 bg-emerald-50' : ''
                }`}
              >
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
          </div>

          {/* Login/Signup Button for Desktop */}
          <div className="hidden md:block">
            <Link to="/login-signup">
              <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Login / Signup
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-3 rounded-xl text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 focus:outline-none transition-all duration-300"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-4 pb-6 space-y-2 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg">
            <Link 
              to="/" 
              onClick={closeMobileMenu} 
              className={`text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                location.pathname === '/' ? 'text-emerald-600 bg-emerald-50' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              to="/properties" 
              onClick={closeMobileMenu} 
              className={`text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                location.pathname === '/properties' ? 'text-emerald-600 bg-emerald-50' : ''
              }`}
            >
              Properties
            </Link>
            <Link 
              to="/about" 
              onClick={closeMobileMenu} 
              className={`text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                location.pathname === '/about' ? 'text-emerald-600 bg-emerald-50' : ''
              }`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              onClick={closeMobileMenu} 
              className={`text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                location.pathname === '/contact' ? 'text-emerald-600 bg-emerald-50' : ''
              }`}
            >
              Contact
            </Link>
            <Link to="/login-signup" onClick={closeMobileMenu} className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white block px-4 py-3 rounded-xl text-base font-medium text-center mt-4 shadow-lg">
              Login / Signup
            </Link>
          </div>
        </div>
      )}
    </nav>
  );

  // Tenant Navbar - Add Contact Link
  const TenantNavbar = () => (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/tenant-home" onClick={closeMobileMenu} className="flex items-center space-x-3 group">
              <img 
                src={logoImage} 
                alt="Rentzy Logo" 
                className="h-12 w-auto brightness-0 invert transition-transform duration-300 group-hover:scale-105" 
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              <Link 
                to="/tenant-home" 
                className={`text-white hover:text-blue-200 hover:bg-blue-700/50 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  location.pathname === '/tenant-home' ? 'bg-blue-800 shadow-lg' : ''
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/search-properties" 
                className={`text-white hover:text-blue-200 hover:bg-blue-700/50 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  location.pathname === '/search-properties' ? 'bg-blue-800 shadow-lg' : ''
                }`}
              >
                Search Properties
              </Link>
              <Link 
                to="/my-applications" 
                className={`text-white hover:text-blue-200 hover:bg-blue-700/50 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  location.pathname === '/my-applications' ? 'bg-blue-800 shadow-lg' : ''
                }`}
              >
                My Applications
              </Link>
              <Link 
                to="/saved-properties" 
                className={`text-white hover:text-blue-200 hover:bg-blue-700/50 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  location.pathname === '/saved-properties' ? 'bg-blue-800 shadow-lg' : ''
                }`}
              >
                Saved Properties
              </Link>
              <Link 
                to="/contact" 
                className={`text-white hover:text-blue-200 hover:bg-blue-700/50 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  location.pathname === '/contact' ? 'bg-blue-800 shadow-lg' : ''
                }`}
              >
                Contact
              </Link>
            </div>
          </div>

          {/* User Info and Logout for Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-blue-800/50 px-4 py-2 rounded-xl">
              <span className="text-blue-100 text-sm">Welcome, <span className="font-semibold text-white">{user?.name}</span></span>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-blue-800 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-3 rounded-xl text-white hover:text-blue-200 hover:bg-blue-700/50 focus:outline-none transition-all duration-300"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-4 pb-6 space-y-2 bg-blue-700 border-t border-blue-500 shadow-lg">
            <Link to="/tenant-home" onClick={closeMobileMenu} className="text-white hover:bg-blue-800 block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300">
              Dashboard
            </Link>
            <Link to="/search-properties" onClick={closeMobileMenu} className="text-white hover:bg-blue-800 block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300">
              Search Properties
            </Link>
            <Link to="/my-applications" onClick={closeMobileMenu} className="text-white hover:bg-blue-800 block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300">
              My Applications
            </Link>
            <Link to="/saved-properties" onClick={closeMobileMenu} className="text-white hover:bg-blue-800 block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300">
              Saved Properties
            </Link>
            <Link to="/contact" onClick={closeMobileMenu} className="text-white hover:bg-blue-800 block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300">
              Contact
            </Link>
            <div className="border-t border-blue-500 pt-4 mt-4">
              <div className="text-blue-100 px-4 py-2 text-sm bg-blue-800/50 rounded-xl mb-2">
                Welcome, <span className="font-semibold text-white">{user?.name}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-blue-800 text-white block w-full text-center px-4 py-3 rounded-xl text-base font-medium hover:bg-blue-900 transition-all duration-300 shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );

  // Homeowner Navbar - Add Contact Link
  const HomeownerNavbar = () => (
    <nav className="bg-gradient-to-r from-emerald-600 to-green-700 shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/owner-home" onClick={closeMobileMenu} className="flex items-center space-x-3 group">
              <img 
                src={logoImage} 
                alt="Rentzy Logo" 
                className="h-12 w-auto brightness-0 invert transition-transform duration-300 group-hover:scale-105" 
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              <Link 
                to="/owner-home" 
                className={`text-white hover:text-green-200 hover:bg-green-700/50 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  location.pathname === '/owner-home' ? 'bg-green-800 shadow-lg' : ''
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/my-properties" 
                className={`text-white hover:text-green-200 hover:bg-green-700/50 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  location.pathname === '/my-properties' ? 'bg-green-800 shadow-lg' : ''
                }`}
              >
                My Properties
              </Link>
              <Link 
                to="/add-property" 
                className={`text-white hover:text-green-200 hover:bg-green-700/50 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  location.pathname === '/add-property' ? 'bg-green-800 shadow-lg' : ''
                }`}
              >
                Add Property
              </Link>
              <Link 
                to="/tenant-applications" 
                className={`text-white hover:text-green-200 hover:bg-green-700/50 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  location.pathname === '/tenant-applications' ? 'bg-green-800 shadow-lg' : ''
                }`}
              >
                Query
              </Link>
              
              
            </div>
          </div>

          {/* User Info and Logout for Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-green-800/50 px-4 py-2 rounded-xl">
              <span className="text-green-100 text-sm">Welcome, <span className="font-semibold text-white">{user?.name}</span></span>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-green-800 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-green-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-3 rounded-xl text-white hover:text-green-200 hover:bg-green-700/50 focus:outline-none transition-all duration-300"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-4 pb-6 space-y-2 bg-green-700 border-t border-green-500 shadow-lg">
            <Link to="/owner-home" onClick={closeMobileMenu} className="text-white hover:bg-green-800 block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300">
              Dashboard
            </Link>
            <Link to="/my-properties" onClick={closeMobileMenu} className="text-white hover:bg-green-800 block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300">
              My Properties
            </Link>
            <Link to="/add-property" onClick={closeMobileMenu} className="text-white hover:bg-green-800 block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300">
              Add Property
            </Link>
            <Link to="/tenant-applications" onClick={closeMobileMenu} className="text-white hover:bg-green-800 block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300">
              Applications
            </Link>
            <Link to="/earnings" onClick={closeMobileMenu} className="text-white hover:bg-green-800 block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300">
              Earnings
            </Link>
            <Link to="/contact" onClick={closeMobileMenu} className="text-white hover:bg-green-800 block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300">
              Contact
            </Link>
            <div className="border-t border-green-500 pt-4 mt-4">
              <div className="text-green-100 px-4 py-2 text-sm bg-green-800/50 rounded-xl mb-2">
                Welcome, <span className="font-semibold text-white">{user?.name}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-green-800 text-white block w-full text-center px-4 py-3 rounded-xl text-base font-medium hover:bg-green-900 transition-all duration-300 shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );

  // Render appropriate navbar based on authentication and role
  if (!isAuthenticated) {
    return <GuestNavbar />;
  }

  switch (user?.role) {
    case 'tenant':
      return <TenantNavbar />;
    case 'homeowner':
      return <HomeownerNavbar />;
    default:
      return <GuestNavbar />;
  }
};

export default Navbar;
