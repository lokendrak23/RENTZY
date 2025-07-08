import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import bgImage from "../assets/login-bg.jpg";
import logoImage from "../assets/lavi.svg";

const getHomePageByRole = (userRole) => {
  switch (userRole) {
    case 'tenant':
      return '/tenant-home';
    case 'homeowner':
      return '/owner-home';
    default:
      return '/'; // fallback to main page
  }
};

const LoginSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [role, setRole] = useState("tenant");
  const [verificationCode, setVerificationCode] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [errors, setErrors] = useState({});
  
  // New state for forgot password modal
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // UPDATED PASSWORD VALIDATION TO MATCH BACKEND
  const validatePassword = (password) => {
    return password.length >= 8 && 
           /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password);
  };

  const sendVerificationCode = async () => {
    if (!email || !validateEmail(email)) {
      alert("Please enter a valid email address first.");
      return;
    }

    try {
      setSendingCode(true);
      const res = await fetch("http://localhost:5000/send-verification-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        alert("Verification code sent!");
        setCodeSent(true);
      } else {
        alert(data.message || "Failed to send verification code.");
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
      alert("Network error. Please try again.");
    } finally {
      setSendingCode(false);
    }
  };

  // UPDATED FORM VALIDATION TO MATCH BACKEND
  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (!isLogin) {
      if (!name) {
        newErrors.name = "Name is required";
      }
      
      // Updated password validation message to match backend requirements
      if (!validatePassword(password)) {
        newErrors.password = "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
      }
      
      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
      
      if (!verificationCode) {
        newErrors.verificationCode = "Verification code is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    try {
      setLoading(true);
      const endpoint = isLogin ? "login" : "register";
      
      const body = isLogin
        ? { email, password }
        : { 
            email, 
            password, 
            confirmPassword,
            name, 
            role,
            verificationCode 
          };
  
      const response = await fetch(`http://localhost:5000/${endpoint}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(body),
      });
  
      const data = await response.json();
  
      if (data.success) {
        login(data.user, data.accessToken);
        
        // Navigate based on user role
        const homePage = getHomePageByRole(data.user.role);
        navigate(homePage);
      } else {
        alert(data.message || `${isLogin ? "Login" : "Registration"} failed.`);
      }
    } catch (error) {
      console.error(`${isLogin ? "Login" : "Registration"} error:`, error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setCodeSent(false);
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center px-4 p-6"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Link to="/" className="absolute top-6 left-6">
        <img src={logoImage} alt="Rentzy Logo" className="h-13 w-auto" />
      </Link>

      <div className="bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          {isLogin ? "Welcome Back" : "Join Rentzy"}
        </h1>

        <div className="space-y-4 mb-6">
          {!isLogin && (
            <div>
              <input 
                type="text" 
                placeholder="Full Name" 
                className={`w-full px-4 py-3 border rounded-md text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
          )}

          <div>
            {!isLogin ? (
              <div className="flex gap-2">
                <div className="flex-1">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className={`w-full px-4 py-3 border rounded-md text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
                <button 
                  onClick={sendVerificationCode} 
                  disabled={sendingCode || !email} 
                  className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {sendingCode ? "Sending..." : codeSent ? "Resend" : "Send Code"}
                </button>
              </div>
            ) : (
              <input 
                type="email" 
                placeholder="Enter your email" 
                className={`w-full px-4 py-3 border rounded-md text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            )}
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {!isLogin && (
            <div>
              <input 
                type="text" 
                placeholder="Verification Code" 
                className={`w-full px-4 py-3 border rounded-md text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.verificationCode ? 'border-red-500' : 'border-gray-300'
                }`}
                value={verificationCode} 
                onChange={(e) => setVerificationCode(e.target.value)} 
              />
              {errors.verificationCode && <p className="text-red-500 text-xs mt-1">{errors.verificationCode}</p>}
            </div>
          )}

          {!isLogin && (
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="tenant">I am a Tenant</option>
              <option value="homeowner">I am a Homeowner</option>
            </select>
          )}

          <div>
            <input 
              type="password" 
              placeholder={isLogin ? "Enter your password" : "Password (min 8 chars: A-Z, a-z, 0-9, !@#$)"} 
              className={`w-full px-4 py-3 border rounded-md text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {!isLogin && (
            <div>
              <input 
                type="password" 
                placeholder="Confirm your password" 
                className={`w-full px-4 py-3 border rounded-md text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
          )}
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={loading || (!isLogin && !codeSent)} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition duration-200 font-semibold shadow-md disabled:opacity-50"
        >
          {loading ? (isLogin ? "Signing in..." : "Creating account...") : isLogin ? "Sign In" : "Create Account"}
        </button>

        {/* Forgot Password Link - Only show during login */}
        {isLogin && (
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200"
            >
              Forgot your password?
            </button>
          </div>
        )}

        <p className="text-sm text-center text-gray-700 mt-5">
          {isLogin ? "New to Rentzy?" : "Already have an account?"}{" "}
          <span 
            onClick={toggleMode} 
            className="text-blue-600 hover:underline cursor-pointer font-medium"
          >
            {isLogin ? "Create an account" : "Sign in"}
          </span>
        </p>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal 
        isVisible={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
};

export default LoginSignup;
