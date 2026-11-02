
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Leave() {
  const user = JSON.parse(
    localStorage.getItem("hostelhub_user") || "null"
  );

  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchRequests() {
    if (!user?.user_id) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/leave/${user.user_id}`
      );

      if (!response.ok) {
        throw new Error("Unable to load leave requests.");
      }

      const data = await response.json();
      setRequests(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!reason.trim() || !fromDate || !toDate) {
      setError("Please complete all fields.");
      return;
    }

    if (fromDate > toDate) {
      setError("The end date cannot be before the start date.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.user_id,
          reason,
          from_date: fromDate,
          to_date: toDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Leave request failed.");
      }

      setMessage("Leave request submitted successfully!");
      setReason("");
      setFromDate("");
      setToDate("");

      await fetchRequests();
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
    <div className="leave-page">
      <nav className="leave-navbar">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/dashboard" className="leave-brand">
            🏠 HostelHub
          </Link>

          <Link to="/dashboard" className="leave-back">
            ← Dashboard
          </Link>
        </div>
      </nav>

      <main className="leave-content">
        <h1 className="leave-heading">Leave Requests</h1>

        <p className="leave-subtitle">
          Apply for leave and track your request status.
        </p>

        <div className="leave-form-card">
          <h3>Apply for Leave</h3>

          {message && (
            <div className="alert alert-success">{message}</div>
          )}

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Reason for Leave</label>

              <textarea
                className="form-control"
                rows="4"
                placeholder="Enter your reason for leave..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">From Date</label>

                <input
                  type="date"
                  className="form-control"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">To Date</label>

                <input
                  type="date"
                  className="form-control"
                  value={toDate}
                  min={fromDate || undefined}
                  onChange={(e) => setToDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Leave Request"}
            </button>
          </form>
        </div>

        <section className="leave-history">
          <h3>My Leave History</h3>

          {requests.length === 0 ? (
            <div className="rooms-message">
              No leave requests submitted yet.
            </div>
          ) : (
            requests.map((request) => (
              <div
                className="leave-history-card"
                key={request.request_id}
              >
                <div className="d-flex justify-content-between flex-wrap gap-2">
                  <h5>Leave Application</h5>

                  <span className="leave-status">
                    {request.status || "Pending"}
                  </span>
                </div>

                <p>{request.reason}</p>

                <div className="leave-dates">
                  <span>
                    <strong>From:</strong>{" "}
                    {new Date(request.from_date).toLocaleDateString()}
                  </span>

                  <span>
                    <strong>To:</strong>{" "}
                    {new Date(request.to_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default Leave;
