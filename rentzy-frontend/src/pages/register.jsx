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

  // This useEffect is for providing live feedback to the user and works correctly.
  useEffect(() => {
    const newErrors = {};
    if (form.password && form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    } else if (form.password && !/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) {
      newErrors.password = "Password must include a special character.";
    }

    if (form.confirmPassword && form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
  }, [form.password, form.confirmPassword]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendVerificationCode = async () => {
    // This function remains unchanged.
    if (!form.email) {
      alert("Please enter an email first.");
      return;
    }
    try {
      setSendingCode(true);
      const res = await fetch("http://localhost:5000/send-verification-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Verification code sent!");
        setCodeSent(true);
      } else {
        alert(data.message || "Failed to send verification code.");
      }
    } catch (err) {
      alert("Error sending code.");
    } finally {
      setSendingCode(false);
    }
  };

  // --- NEW: A dedicated, synchronous validation function ---
  const validate = () => {
    const { name, email, password, confirmPassword, verificationCode } = form;
    const validationErrors = {};

    if (!name || !email || !password || !confirmPassword || !verificationCode) {
      alert("Please fill all fields.");
      return false; // Validation fails
    }
    if (password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters.";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      validationErrors.password = "Password must include a special character.";
    }
    if (password !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Update the UI to show errors
      return false; // Validation fails
    }

    return true; // Validation passes
  };


  const handleRegister = async () => {
    // --- UPDATED: Call the validate function first ---
    if (!validate()) {
      // If validation fails, immediately stop the function.
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        alert("Signup successful! You will now be redirected.");
        login(data.user);
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (err) {
      alert("Server error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 shadow-md rounded-xl mt-10 space-y-4">
      <h2 className="text-2xl font-bold text-center">Register on Rentzy</h2>

      <input type="text" name="name" placeholder="Full Name" className="w-full p-3 border rounded" value={form.name} onChange={handleChange} />

      <div className="flex gap-2">
        <input type="email" name="email" placeholder="Email" className="flex-grow p-3 border rounded" value={form.email} onChange={handleChange} />
        <button onClick={sendVerificationCode} disabled={sendingCode} className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 disabled:opacity-50" > {sendingCode ? "Sending..." : "Send Code"} </button>
      </div>

      <input type="text" name="verificationCode" placeholder="Verification Code" className="w-full p-3 border rounded" value={form.verificationCode} onChange={handleChange} />

      <div>
        <input
          type="password"
          name="password"
          placeholder="Password"
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
        disabled={isSubmitting}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-semibold disabled:opacity-50"
      >
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </div>
  );
};

export default Register;
