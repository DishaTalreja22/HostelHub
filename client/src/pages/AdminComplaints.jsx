
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function fetchComplaints() {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/complaints"
      );
      setComplaints(response.data);
    } catch (error) {
      setMessage("Unable to load complaints.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchComplaints();
  }, []);

  async function updateStatus(complaintId, status) {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/complaints/${complaintId}/status`,
        { status }
      );

      setMessage("Complaint status updated successfully!");
      await fetchComplaints();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Unable to update complaint status."
      );
    }
  }

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
        <h1 className="fw-bold">Complaint Management</h1>
        <p className="text-secondary">
          Review student complaints and manage their progress.
        </p>

        <div className="row g-3 my-3">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-3">
              <p className="text-secondary mb-1">Total Complaints</p>
              <h3>{complaints.length}</h3>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-3">
              <p className="text-secondary mb-1">Pending</p>
              <h3>
                {complaints.filter((c) => c.status === "pending").length}
              </h3>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-3">
              <p className="text-secondary mb-1">Resolved</p>
              <h3>
                {complaints.filter((c) => c.status === "resolved").length}
              </h3>
            </div>
          </div>
        </div>

        {message && (
          <div className="alert alert-info">{message}</div>
        )}

        {loading ? (
          <p>Loading complaints...</p>
        ) : (
          <div className="row g-4">
            {complaints.map((complaint) => (
              <div className="col-12" key={complaint.complaint_id}>
                <div className="card border-0 shadow-sm p-4">
                  <div className="d-flex justify-content-between flex-wrap gap-2">
                    <h5>{complaint.subject}</h5>
                    <span className="badge bg-primary">
                      Complaint #{complaint.complaint_id}
                    </span>
                  </div>

                  <p className="text-secondary mb-1">
                    Student: {complaint.full_name}
                  </p>

                  <p className="text-secondary mb-3">
                    Email: {complaint.email}
                  </p>

                  <p>{complaint.description}</p>

                  <p className="small text-secondary">
                    Submitted:{" "}
                    {complaint.created_at
                      ? new Date(complaint.created_at).toLocaleString()
                      : "Date unavailable"}
                  </p>

                  <div className="row align-items-center">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        Update Status
                      </label>

                      <select
                        className="form-select"
                        value={complaint.status}
                        onChange={(e) =>
                          updateStatus(
                            complaint.complaint_id,
                            e.target.value
                          )
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {complaints.length === 0 && (
              <div className="col-12">
                <div className="alert alert-light">
                  No complaints have been submitted yet.
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminComplaints;
