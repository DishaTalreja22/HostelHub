
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("hostelhub_user") || "null"
  );

  function handleLogout() {
    localStorage.removeItem("hostelhub_token");
    localStorage.removeItem("hostelhub_user");
    navigate("/login");
  }

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <h2>Please log in first.</h2>
        <Link to="/login" className="btn btn-primary mt-3">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* Navigation Bar */}
      <nav className="dashboard-navbar">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/dashboard" className="dashboard-brand">
            🏠 HostelHub
          </Link>

          <button
            className="btn btn-outline-light"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="dashboard-content">

        {/* Welcome Section */}
        <section className="dashboard-welcome">
          <h1>
            Welcome, {user.full_name}!
          </h1>

          <p>
            Your hostel life, managed in one place.
            Access your hostel services from your dashboard.
          </p>
        </section>

        {/* Services Section */}
        <h3 className="dashboard-section-title">
          Hostel Services
        </h3>

        <div className="row g-4">

          {/* Room Details */}
          <div className="col-md-6 col-lg-4">
            <Link
              to="/rooms"
              className="dashboard-card d-block text-decoration-none"
            >
              <div className="dashboard-card-icon">
                🛏️
              </div>

              <h4>Room Details</h4>

              <p>
                View room information, capacity,
                monthly fees and availability.
              </p>

              <span className="text-primary fw-bold">
                View Rooms →
              </span>
            </Link>
          </div>

          {/* Complaints */}
          <div className="col-md-6 col-lg-4">
            <Link
              to="/complaints"
              className="dashboard-card d-block text-decoration-none"
            >
              <div className="dashboard-card-icon">
                📢
              </div>

              <h4>Complaints</h4>

              <p>
                Submit hostel-related complaints
                and track their status.
              </p>

              <span className="text-primary fw-bold">
                Manage Complaints →
              </span>
            </Link>
          </div>

          {/* Leave Requests */}
          <div className="col-md-6 col-lg-4">
            <Link
              to="/leave"
              className="dashboard-card d-block text-decoration-none"
            >
              <div className="dashboard-card-icon">
                📝
              </div>

              <h4>Leave Requests</h4>

              <p>
                Submit leave requests and
                check their approval status.
              </p>

              <span className="text-primary fw-bold">
                View Leave Requests →
              </span>
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Dashboard;
