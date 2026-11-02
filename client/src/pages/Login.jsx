
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";


// Automatically attach JWT to Admin API requests
axios.interceptors.request.use((config) => {
  if (config.url?.includes("/api/admin/")) {
    const token = localStorage.getItem("hostelhub_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        { email, password }
      );

      localStorage.setItem("hostelhub_token", response.data.token);
      localStorage.setItem(
        "hostelhub_user",
        JSON.stringify(response.data.user)
      );

    navigate(
  response.data.user.role === "admin" ? "/admin" : "/dashboard"
);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Login failed. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">

      <div className="auth-container">

        <div className="auth-card">

          <Link to="/" className="auth-brand">
            🏠 HostelHub
          </Link>

          <div className="auth-icon">👋</div>

          <h2>Welcome Back!</h2>

          <p>Sign in to access your hostel dashboard.</p>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">Email Address</label>

              <input
                className="form-control"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>

              <input
                className="form-control"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {message && (
              <div className="alert alert-danger">
                {message}
              </div>
            )}

            <button
              className="btn btn-primary w-100"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Sign In →"}
            </button>

          </form>

          <div className="auth-divider">
            New to HostelHub?
          </div>

          <p className="auth-bottom">
            Don't have an account?{" "}
            <Link to="/register">Create Account</Link>
          </p>

          <Link to="/" className="auth-home-link">
            ← Back to Home
          </Link>

        </div>
      </div>
    </div>
  );
}

export default Login;


