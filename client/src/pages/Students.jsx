
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/students"
        );
        setStudents(response.data);
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
          "Unable to load students."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) =>
    `${student.full_name} ${student.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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
        <h1 className="fw-bold">Student Management</h1>
        <p className="text-secondary">
          View and search registered hostel students.
        </p>

        <div className="card border-0 shadow-sm p-4 mt-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
            <h5 className="mb-0">Registered Students</h5>
            <span className="badge bg-primary fs-6">
              Total: {students.length}
            </span>
          </div>

          <input
            type="text"
            className="form-control mb-4"
            placeholder="Search by student name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {loading && <p>Loading students...</p>}

          {message && (
            <div className="alert alert-danger">{message}</div>
          )}

          {!loading && !message && (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Student ID</th>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Role</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.user_id}>
                      <td>#{student.user_id}</td>
                      <td className="fw-semibold">
                        {student.full_name}
                      </td>
                      <td>{student.email}</td>
                      <td>
                        <span className="badge bg-success">
                          Student
                        </span>
                      </td>
                    </tr>
                  ))}

                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        No students found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Students;
