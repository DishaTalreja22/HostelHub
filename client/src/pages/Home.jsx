
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
        <Link className="navbar-brand fw-bold fs-3" to="/">
          HostelHub
        </Link>

        <div className="ms-auto d-flex gap-2">
          <Link to="/login" className="btn btn-outline-light">
            Login
          </Link>
          <Link to="/register" className="btn btn-light text-primary">
            Register
          </Link>
        </div>
      </nav>

      <section className="hero-section text-center">
        <div className="container">
          <span className="badge bg-primary-subtle text-primary mb-3 p-2">
            SMART HOSTEL MANAGEMENT
          </span>

          <h1 className="display-3 fw-bold">
            Your Hostel Life,
            <br />
            Made <span className="text-primary">Simpler.</span>
          </h1>

          <p className="lead text-secondary mt-4">
            One platform to manage rooms, fees, complaints, leave
            requests, and hostel notices with ease.
          </p>

          <div className="mt-4 d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started
            </Link>
            <a href="#features" className="btn btn-outline-primary btn-lg">
              Explore Features
            </a>
          </div>

          <div className="hero-card mt-5 mx-auto">
            <div className="row g-3">
              <div className="col-md-4">
                <div className="stat-box">
                  <div className="stat-icon">🏠</div>
                  <h5>Room Management</h5>
                  <p>Find and manage room details easily.</p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="stat-box">
                  <div className="stat-icon">💳</div>
                  <h5>Fee Tracking</h5>
                  <p>Keep hostel fee records organized.</p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="stat-box">
                  <div className="stat-icon">📢</div>
                  <h5>Instant Updates</h5>
                  <p>Stay informed about hostel notices.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Everything in One Place</h2>
            <p className="text-secondary">
              Simple tools for students and hostel administrators.
            </p>
          </div>

          <div className="row g-4">
            <Feature
              icon="🎓"
              title="Student Dashboard"
              description="View room details, submit complaints, request leave, and check fees."
            />
            <Feature
              icon="🛡️"
              title="Warden Dashboard"
              description="Manage room allocations, review leave requests, and handle complaints."
            />
            <Feature
              icon="⚙️"
              title="Admin Dashboard"
              description="Manage hostels, rooms, users, fee records, and reports."
            />
          </div>
        </div>
      </section>

      <footer className="text-center py-4 text-secondary">
        <p className="mb-1">© 2026 HostelHub</p>
        <small>Smarter management. Better hostel living.</small>
      </footer>
    </div>
  );
}

function Feature({ icon, title, description }) {
  return (
    <div className="col-md-4">
      <div className="feature-card h-100">
        <div className="stat-icon">{icon}</div>
        <h4 className="mt-3">{title}</h4>
        <p className="text-secondary mb-0">{description}</p>
      </div>
    </div>
  );
}

export default Home;
