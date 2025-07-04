import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { username, email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/signup`,
        formData
      );
      toast.success("Signup successful!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={onChange}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-indigo-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-indigo-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-indigo-200"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4 flex items-center justify-center">
          <span className="text-sm text-gray-500">Or</span>
        </div>

        {/* ✅ Google Signup Button */}
        <button
          onClick={() => {
            window.location.href = "https://notenest-lzm0.onrender.com/api/auth/google";
          }}
          className="w-full flex items-center justify-center gap-2 py-3 mt-2 text-gray-700 font-semibold rounded-xl border border-gray-300 bg-white hover:bg-gray-100 transition duration-300"
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
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
