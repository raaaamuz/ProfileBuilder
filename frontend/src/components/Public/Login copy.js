import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  console.log(formData)
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };
  

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.username || !formData.password) {
    setError("Username and password cannot be empty");
    return;
  }

  try {
    const response = await api.post("/users/login/", formData);

    localStorage.setItem("token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);

    navigate("/admin/home");
  } catch (error) {
    console.error("Error logging in:", error.response?.data || error);
    setError("Invalid username or password");
  }
};

  
  return (
    <div className="max-w-md mx-auto p-8">
      <h2 className="text-3xl font-bold text-red-500 mb-6">Login</h2>

      {error && <p className="text-red-600 font-semibold">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-semibold">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <button type="submit" className="bg-red-500 text-white px-6 py-3 rounded-lg">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;   