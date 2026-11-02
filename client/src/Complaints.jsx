
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Complaints() {
  const user = JSON.parse(localStorage.getItem("hostelhub_user") || "null");

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchComplaints() {
    if (!user?.user_id) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/complaints/${user.user_id}`
      );

      if (!response.ok) throw new Error("Unable to load complaints.");

      const data = await response.json();
      setComplaints(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchComplaints();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!subject.trim() || !description.trim()) {
      setError("Please complete all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
          subject,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Complaint submission failed.");
      }

      setMessage("Your complaint has been submitted successfully!");
      setSubject("");
      setDescription("");
      await fetchComplaints();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="container py-5">
        <h3>Please log in first.</h3>
        <Link to="/login">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="complaints-page">
      <nav className="complaints-navbar">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/dashboard" className="complaints-brand">
            🏠 HostelHub
          </Link>
          <Link to="/dashboard" className="complaints-back">
            ← Dashboard
          </Link>
        </div>
      </nav>

      <main className="complaints-content">
        <h1 className="complaints-heading">Complaints & Support</h1>
        <p className="complaints-subtitle">
          Submit an issue and keep track of its progress.
        </p>

        <div className="complaint-form-card">
          <h3>Submit a Complaint</h3>

          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Complaint Subject</label>
              <select
                className="form-select"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                <option value="Room Maintenance">Room Maintenance</option>
                <option value="Water Supply">Water Supply</option>
                <option value="Electricity">Electricity</option>
                <option value="Cleanliness">Cleanliness</option>
                <option value="Food Quality">Food Quality</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Describe Your Complaint</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Explain your issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </form>
        </div>

        <section className="complaints-history">
          <h3>My Previous Complaints</h3>

          {complaints.length === 0 ? (
            <div className="rooms-message">
              No complaints submitted yet.
            </div>
          ) : (
            complaints.map((complaint) => (
              <div className="complaint-history-card" key={complaint.complaint_id}>
                <div className="d-flex justify-content-between flex-wrap gap-2">
                  <h5>{complaint.subject}</h5>
                  <span className="complaint-status">
                    {complaint.status || "Pending"}
                  </span>
                </div>
                <p>{complaint.description}</p>
                <small>
                  Submitted:{" "}
                  {complaint.created_at
                    ? new Date(complaint.created_at).toLocaleDateString()
                    : "Date unavailable"}
                </small>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default Complaints;
