
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function fetchRooms() {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/rooms"
      );
      setRooms(response.data);
    } catch (error) {
      setMessage("Unable to load rooms.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRooms();
  }, []);

  async function updateStatus(roomId, status) {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/rooms/${roomId}/status`,
        { status }
      );

      setMessage("Room status updated successfully!");
      await fetchRooms();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Unable to update room status."
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
        <h1 className="fw-bold">Room Management</h1>
        <p className="text-secondary">
          View hostel rooms and manage their availability.
        </p>

        <div className="row g-3 my-3">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-3">
              <p className="text-secondary mb-1">Total Rooms</p>
              <h3>{rooms.length}</h3>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-3">
              <p className="text-secondary mb-1">Available Rooms</p>
              <h3>
                {rooms.filter((r) => r.status === "available").length}
              </h3>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-3">
              <p className="text-secondary mb-1">Full / Maintenance</p>
              <h3>
                {rooms.filter((r) => r.status !== "available").length}
              </h3>
            </div>
          </div>
        </div>

        {message && (
          <div className="alert alert-info">{message}</div>
        )}

        {loading ? (
          <p>Loading rooms...</p>
        ) : (
          <div className="row g-4">
            {rooms.map((room) => (
              <div className="col-md-6 col-lg-4" key={room.room_id}>
                <div className="card border-0 shadow-sm p-4 h-100">
                  <h4>🛏️ Room {room.room_number}</h4>

                  <p className="text-secondary mb-2">
                    {room.hostel_name}
                  </p>

                  <p>Capacity: {room.capacity} students</p>

                  <p>
                    Monthly Fee: ₹
                    {Number(room.monthly_fee).toLocaleString("en-IN")}
                  </p>

                  <p>
                    Current Status:{" "}
                    <strong>{room.status}</strong>
                  </p>

                  <label className="form-label fw-semibold">
                    Change Room Status
                  </label>

                  <select
                    className="form-select"
                    value={room.status}
                    onChange={(e) =>
                      updateStatus(room.room_id, e.target.value)
                    }
                  >
                    <option value="available">Available</option>
                    <option value="full">Full</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
            ))}

            {rooms.length === 0 && (
              <div className="col-12">
                <p>No rooms found.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminRooms;
