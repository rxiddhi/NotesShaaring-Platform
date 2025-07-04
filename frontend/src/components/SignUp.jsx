import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { username, email, password, confirmPassword } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/signup`,
        { username, email, password }
      );
      toast.success("Signup successful!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md flex flex-col items-center">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
          <FaUser className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-1">Create Your Account</h2>
        <p className="text-center text-gray-500 mb-6">Join us and start sharing your notes today</p>
        <form onSubmit={onSubmit} className="space-y-4 w-full">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={onChange}
              required
              placeholder="Enter your username"
              className="mt-1 block w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-300 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              placeholder="Enter your email"
              className="mt-1 block w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-300 bg-gray-50"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={onChange}
              required
              placeholder="Enter your password"
              className="mt-1 block w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-300 bg-gray-50 pr-16"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-8 text-xs text-gray-500 hover:text-indigo-600 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? "Hide" : "Open"}
            </button>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              required
              placeholder="Confirm your password"
              className="mt-1 block w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-300 bg-gray-50 pr-16"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute right-3 top-8 text-xs text-gray-500 hover:text-indigo-600 focus:outline-none"
              tabIndex={-1}
            >
              {showConfirmPassword ? "Hide" : "Open"}
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-lg shadow hover:from-purple-600 hover:to-indigo-600 transition-all duration-200"
          >
            Create Account
          </button>
        </form>
        <div className="w-full flex items-center gap-2 my-4">
          <hr className="flex-1 border-gray-200" />
          <span className="text-gray-400 text-sm">or</span>
          <hr className="flex-1 border-gray-200" />
        </div>
        <button
          onClick={() => {
            window.location.href =
              (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000") + "/api/auth/google-signup";
          }}
          className="w-full flex items-center justify-center gap-2 py-3 text-gray-700 font-semibold rounded-xl border border-gray-300 bg-white hover:bg-gray-100 transition duration-300"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="w-5 h-5"
          />
          Sign up with Google
        </button>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
