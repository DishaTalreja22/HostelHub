
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function AdminLeave() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function fetchRequests() {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/leave"
      );
      setRequests(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Unable to load leave requests."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  async function updateStatus(requestId, status) {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/leave/${requestId}/status`,
        { status }
      );

      setMessage("Leave request updated successfully!");
      await fetchRequests();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Unable to update leave request."
      );
    }
  }

  const pending = requests.filter(
    (r) => r.status === "pending"
  ).length;

  const approved = requests.filter(
    (r) => r.status === "approved"
  ).length;

  const rejected = requests.filter(
    (r) => r.status === "rejected"
  ).length;

  return (
    <div className="students-page">
      <nav className="admin-navbar">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/admin" className="admin-brand">
            🏠 HostelHub Admin
          </Link>

          <Link to="/admin" className="btn btn-outline-light">
            ← Dashboard
          </Link>
        </div>
      </nav>

      <main className="container py-5">
        <h1 className="fw-bold">Leave Request Management</h1>

        <p className="text-secondary">
          Review student leave applications and manage approvals.
        </p>

        <div className="row g-3 my-3">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm p-3">
              <p className="text-secondary mb-1">Total Requests</p>
              <h3>{requests.length}</h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm p-3">
              <p className="text-secondary mb-1">Pending</p>
              <h3>{pending}</h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm p-3">
              <p className="text-secondary mb-1">Approved</p>
              <h3>{approved}</h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm p-3">
              <p className="text-secondary mb-1">Rejected</p>
              <h3>{rejected}</h3>
            </div>
          </div>
        </div>

        {message && (
          <div className="alert alert-info">{message}</div>
        )}

        {loading ? (
          <p>Loading leave requests...</p>
        ) : (
          <div className="row g-4">
            {requests.map((request) => (
              <div className="col-12" key={request.request_id}>
                <div className="card border-0 shadow-sm p-4">
                  <div className="d-flex justify-content-between flex-wrap gap-2">
                    <h5>
                      Leave Request #{request.request_id}
                    </h5>

                    <span className="badge bg-primary">
                      {request.status}
                    </span>
                  </div>

                  <hr />

                  <p className="mb-1">
                    <strong>Student:</strong> {request.full_name}
                  </p>

                  <p className="mb-1">
                    <strong>Email:</strong> {request.email}
                  </p>

                  <p className="mb-1">
                    <strong>Reason:</strong> {request.reason}
                  </p>

                  <p className="mb-3">
                    <strong>Leave Dates:</strong>{" "}
                    {String(request.from_date).split("T")[0]}
                    {" to "}
                    {String(request.to_date).split("T")[0]}
                  </p>

                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        Update Request Status
                      </label>

                      <select
                        className="form-select"
                        value={request.status}
                        onChange={(e) =>
                          updateStatus(
                            request.request_id,
                            e.target.value
                          )
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {requests.length === 0 && (
              <div className="col-12">
                <div className="alert alert-light">
                  No leave requests have been submitted yet.
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminLeave;

