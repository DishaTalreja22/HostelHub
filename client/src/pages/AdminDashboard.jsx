
import { Link, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("hostelhub_user") || "null"
  );

  if (!user || user.role !== "admin") {
    return (
      <div className="admin-denied">
        <h2>Access Denied</h2>
        <p>You are not authorized to access this page.</p>
        <Link to="/login">Go to Login</Link>
      </div>
    );
  }

  const modules = [
    {
      icon: "👨‍🎓",
      title: "Student Management",
      description: "View registered students and manage student information.",
      link: "/admin/students",
      color: "blue",
      action: "Manage Students"
    },
    {
      icon: "🛏️",
      title: "Room Management",
      description: "Monitor hostel rooms, availability and room status.",
      link: "/admin/rooms",
      color: "purple",
      action: "Manage Rooms"
    },
    {
      icon: "📢",
      title: "Complaint Management",
      description: "Review student complaints and track their resolution.",
      link: "/admin/complaints",
      color: "orange",
      action: "View Complaints"
    },
    {
      icon: "📋",
      title: "Leave Approvals",
      description: "Review leave applications and approve or reject requests.",
      link: "/admin/leave",
      color: "green",
      action: "Review Requests"
    }
  ];

  function handleLogout() {
    localStorage.removeItem("hostelhub_token");
    localStorage.removeItem("hostelhub_user");
    navigate("/login");
  }

  return (
   <div className="admin-layout">
  

      {/* Sidebar */}
      <aside className="admin-sidebar">

        <div className="admin-logo">
          <span className="logo-icon">🏠</span>
          <div>
            <h3>HostelHub</h3>
            <small>Management Portal</small>
          </div>
        </div>

        <div className="sidebar-label">MAIN MENU</div>

        <Link to="/admin" className="sidebar-link active">
          <span>▦</span> Dashboard
        </Link>

        <Link to="/admin/students" className="sidebar-link">
          <span>👨‍🎓</span> Students
        </Link>

        <Link to="/admin/rooms" className="sidebar-link">
          <span>🛏️</span> Rooms
        </Link>

        <Link to="/admin/complaints" className="sidebar-link">
          <span>📢</span> Complaints
        </Link>

        <Link to="/admin/leave" className="sidebar-link">
          <span>📋</span> Leave Requests
        </Link>

        <div className="sidebar-bottom">
          <div className="sidebar-admin">
            <div className="admin-avatar">A</div>
            <div>
              <strong>Administrator</strong>
              <small>System Admin</small>
            </div>
          </div>

          <button className="sidebar-logout" onClick={handleLogout}>
            ↪ Logout
          </button>
        </div>

      </aside>

      {/* Main Content */}
      <main className="admin-main">

        <header className="admin-topbar">
          <div>
            <h2>Dashboard Overview</h2>
            <p>Welcome to your HostelHub management portal.</p>
          </div>

          <div className="topbar-profile">
            <div className="topbar-avatar">A</div>
            <div>
              <strong>{user.full_name}</strong>
              <small>Administrator</small>
            </div>
          </div>
        </header>

        <section className="admin-welcome">
          <div>
            <span className="welcome-tag">ADMINISTRATOR PORTAL</span>
            <h1>Welcome back, {user.full_name}!</h1>
            <p>
              Manage hostel operations, students, rooms and requests
              from one convenient dashboard.
            </p>
          </div>
          <div className="welcome-illustration">🏢</div>
        </section>

        <section className="admin-section">
          <div className="section-heading">
            <div>
              <h2>Management Modules</h2>
              <p>Choose a module to manage hostel activities.</p>
            </div>
            <span className="module-count">04 MODULES</span>
          </div>

          <div className="admin-module-grid">
            {modules.map((module) => (
              <div
                className="admin-module-card"
                key={module.title}
              >
                <div className={`module-icon ${module.color}`}>
                  {module.icon}
                </div>

                <h3>{module.title}</h3>
                <p>{module.description}</p>

                <Link to={module.link} className="module-action">
                  {module.action} <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-bottom-panel">
          <div>
            <h3>HostelHub Management System</h3>
            <p>
              A centralized platform for efficient hostel
              administration and student services.
            </p>
          </div>
          <div className="system-status">
            <span className="status-dot"></span>
            Admin Portal
          </div>
        </section>

        <footer className="admin-footer">
          © 2026 HostelHub. All rights reserved.
        </footer>

      </main>
    </div>
  );
}

export default AdminDashboard;
