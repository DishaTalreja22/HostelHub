
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/register",
        {
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
        }
      );

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Unable to register. Check that the backend is running."
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

          <div className="auth-icon">✨</div>

          <h2>Create Your Account</h2>

          <p>Join HostelHub and simplify your hostel experience.</p>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">Full Name</label>

              <input
                className="form-control"
                type="text"
                name="full_name"
                placeholder="Enter your full name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email Address</label>

              <input
                className="form-control"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>

              <input
                className="form-control"
                type="password"
                name="password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Confirm Password</label>

              <input
                className="form-control"
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                minLength={8}
                required
              />
            </div>

            {message && (
              <div className="alert alert-info" role="status">
                {message}
              </div>
            )}

            <button
              className="btn btn-primary w-100"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account →"}
            </button>

          </form>

          <div className="auth-divider">
            Already registered?
          </div>

          <p className="auth-bottom">
            Already have an account?{" "}
            <Link to="/login">Sign In</Link>
          </p>

          <Link to="/" className="auth-home-link">
            ← Back to Home
          </Link>

        </div>
      </div>
    </div>
  );
}

export default Register;
