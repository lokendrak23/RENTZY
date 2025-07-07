import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // <-- IMPORT useNavigate
import { useAuth } from "../context/AuthContext"; // <-- IMPORT useAuth
import bgImage from "../assets/login-bg.jpg";
import logoImage from "../assets/lavi.svg";

const LoginSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [userType, setUserType] = useState("tenant");
  const [verificationCode, setVerificationCode] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- NEW: Initialize hooks ---
  const { login } = useAuth();
  const navigate = useNavigate();

  const sendVerificationCode = async () => {
    // ... (This function is correct and does not need changes)
    if (!email) {
      alert("Please enter an email first.");
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
      } else {
        alert(data.message || "Failed to send code.");
      }
    } catch (err) {
      alert("Error sending verification code.");
    } finally {
      setSendingCode(false);
    }
  };

  // --- UPDATED: handleSubmit function ---
  const handleSubmit = async () => {
    if ((isLogin && (!email || !password)) || (!isLogin && (!name || !email || !password || !confirmPassword || !verificationCode))) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const endpoint = isLogin ? "login" : "register";
      
      // Create the correct body for each endpoint
      const body = isLogin
        ? { email, password }
        : { email, password, name, userType, verificationCode };

      const response = await fetch(`http://localhost:5000/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        // On success, update the global auth state and redirect
        login(data.user);
        navigate('/');
      } else {
        alert(data.message || `${isLogin ? "Login" : "Signup"} failed.`);
      }
    } catch (err) {
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... (Your JSX is correct and does not need changes)
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center px-4 p-6"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Link to="/" className="absolute top-6 left-6">
        <img src={logoImage} alt="Rentzy Logo" className="h-13 w-auto" />
      </Link>

      <div className="bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          {isLogin ? "Login" : "Create Account"}
        </h1>

        <div className="space-y-4 mb-6">
          {!isLogin && (
            <>
              <input type="text" placeholder="Full Name" className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800 outline-none focus:ring-2 focus:ring-blue-500" value={name} onChange={(e) => setName(e.target.value)} />
              <div className="flex gap-2">
                <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-gray-800 outline-none focus:ring-2 focus:ring-blue-500" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button onClick={sendVerificationCode} disabled={sendingCode} className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 disabled:opacity-50" > {sendingCode ? "Sending..." : "Send Code"} </button>
              </div>
              <input type="text" placeholder="Verification Code" className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800 outline-none focus:ring-2 focus:ring-blue-500" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
              <select value={userType} onChange={(e) => setUserType(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800 outline-none focus:ring-2 focus:ring-blue-500" >
                <option value="tenant">I am a Tenant</option>
                <option value="homeowner">I am a Homeowner</option>
              </select>
            </>
          )}

          {isLogin && ( <input type="email" placeholder="Enter your email" className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800 outline-none focus:ring-2 focus:ring-blue-500" value={email} onChange={(e) => setEmail(e.target.value)} /> )}
          <input type="password" placeholder="Enter your password" className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800 outline-none focus:ring-2 focus:ring-blue-500" value={password} onChange={(e) => setPassword(e.target.value)} />
          {!isLogin && ( <input type="password" placeholder="Confirm your password" className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800 outline-none focus:ring-2 focus:ring-blue-500" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /> )}
        </div>
        <button onClick={handleSubmit} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition duration-200 font-semibold shadow-md disabled:opacity-50" > {loading ? (isLogin ? "Logging in..." : "Signing up...") : isLogin ? "Login" : "Sign Up"} </button>
        <p className="text-sm text-center text-gray-700 mt-5">
          {isLogin ? "New to Rentzy?" : "Already have an account?"}{" "}
          <span onClick={() => setIsLogin(!isLogin)} className="text-blue-600 hover:underline cursor-pointer font-medium" > {isLogin ? "Create an account" : "Login"} </span>
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;
