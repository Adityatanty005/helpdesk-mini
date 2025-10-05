import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { setToken, setUser } from "../utils/auth";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await api.post("/api/auth/register", form);
    setToken(res.data.token);
    setUser(res.data);
    navigate("/tickets");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-6 w-96"
      >
        <h1 className="text-2xl font-semibold mb-4 text-center text-indigo-600">
          Register
        </h1>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-md p-2 mb-3"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-md p-2 mb-3"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-md p-2 mb-4"
          required
        />

        <button
          type="submit"
          className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md w-full hover:bg-indigo-700"
        >
          Register
        </button>

        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
