import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "homeowner",
    verificationCode: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Real-time validation with debouncing - UPDATED TO MATCH BACKEND
  useEffect(() => {
    const timer = setTimeout(() => {
      const pwd = form.password.trim();
      const cpwd = form.confirmPassword.trim();
      const newErrors = {};

      // Updated password validation to match backend requirements
      if (pwd && pwd.length < 8) {
        newErrors.password = "Password must be at least 8 characters.";
      } else if (pwd && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(pwd)) {
        newErrors.password = "Password must contain uppercase, lowercase, number, and special character.";
      }

      // Confirm password validation
      if (pwd && cpwd && pwd !== cpwd) {
        newErrors.confirmPassword = "Passwords do not match.";
      }

      // Email validation
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        newErrors.email = "Please enter a valid email address.";
      }

      setErrors(newErrors);
    }, 300);

    return () => clearTimeout(timer);
  }, [form.password, form.confirmPassword, form.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const sendVerificationCode = async () => {
    if (!form.email.trim()) {
      alert("Please enter an email first.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      setSendingCode(true);
      const res = await fetch("http://localhost:5000/send-verification-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.trim() }),
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

  // UPDATED VALIDATION FUNCTION TO MATCH BACKEND
  const validateForm = () => {
    const { name, email, password, confirmPassword, verificationCode } = form;
    const validationErrors = {};

    // Required fields
    if (!name.trim()) validationErrors.name = "Name is required.";
    if (!email.trim()) validationErrors.email = "Email is required.";
    if (!password.trim()) validationErrors.password = "Password is required.";
    if (!confirmPassword.trim()) validationErrors.confirmPassword = "Confirm password is required.";
    if (!verificationCode.trim()) validationErrors.verificationCode = "Verification code is required.";

    // Email format
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.email = "Please enter a valid email address.";
    }

    // Updated password strength validation to match backend
    if (password && password.length < 8) {
      validationErrors.password = "Password must be at least 8 characters.";
    } else if (password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
      validationErrors.password = "Password must contain uppercase, lowercase, number, and special character.";
    }

    // Password match
    if (password && confirmPassword && password !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    setErrors({});
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
        confirmPassword: form.confirmPassword.trim(),
        role: form.role,
        verificationCode: form.verificationCode.trim()
      };

      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        alert("Registration successful! Welcome to Rentzy!");
        login(data.user, data.accessToken);
        navigate("/");
      } else {
        alert(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 shadow-md rounded-xl mt-10 space-y-4">
      <h2 className="text-2xl font-bold text-center">Register on Rentzy</h2>

      <div>
        <input
          name="name"
          placeholder="Full Name"
          className={`w-full p-3 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div className="flex gap-2">
        <div className="flex-grow">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className={`w-full p-3 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <button
          onClick={sendVerificationCode}
          disabled={sendingCode || !form.email}
          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {sendingCode ? "Sending…" : codeSent ? "Resend" : "Send Code"}
        </button>
      </div>

      <div>
        <input
          name="verificationCode"
          placeholder="Verification Code"
          className={`w-full p-3 border rounded ${errors.verificationCode ? 'border-red-500' : 'border-gray-300'}`}
          value={form.verificationCode}
          onChange={handleChange}
        />
        {errors.verificationCode && <p className="text-red-500 text-xs mt-1">{errors.verificationCode}</p>}
      </div>

      <div>
        <input
          type="password"
          name="password"
          placeholder="Password (min 8 chars with uppercase, lowercase, number, special char)"
          autoCapitalize="off"
          autoComplete="new-password"
          className={`w-full p-3 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          value={form.password}
          onChange={handleChange}
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>

      <div>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          autoCapitalize="off"
          autoComplete="new-password"
          className={`w-full p-3 border rounded ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
          value={form.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
      </div>

      <select
        name="role"
        className="w-full p-3 border rounded"
        value={form.role}
        onChange={handleChange}
      >
        <option value="tenant">I am a Tenant</option>
        <option value="homeowner">I am a Homeowner</option>
      </select>

      <button
        onClick={handleRegister}
        disabled={isSubmitting || !codeSent}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-semibold disabled:opacity-50"
      >
        {isSubmitting ? "Creating Account…" : "Register"}
      </button>
    </div>
  );
};

export default Register;
