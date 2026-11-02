
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/rooms")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to fetch rooms");
        }
        return response.json();
      })
      .then((data) => {
        setRooms(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const availableRooms = rooms.filter(
    (room) => room.status === "available"
  ).length;

  const fullRooms = rooms.filter(
    (room) => room.status === "full"
  ).length;

  return (
    <div className="rooms-page">

      {/* Navigation */}
      <nav className="rooms-navbar">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/dashboard" className="rooms-brand">
            🏠 HostelHub
          </Link>

          <Link to="/dashboard" className="rooms-back">
            ← Dashboard
          </Link>
        </div>
      </nav>

      <main className="rooms-content">

        {/* Heading */}
        <div className="mb-4">
          <h1 className="rooms-heading">
            Hostel Room Management
          </h1>

          <p className="rooms-subtitle">
            Explore room details, capacity and availability.
          </p>
        </div>

        {/* Summary Cards */}
        {!loading && !error && (
          <div className="row g-3 mb-4">

            <div className="col-md-4">
              <div className="rooms-summary">
                <div className="rooms-summary-label">
                  Total Rooms
                </div>
                <div className="rooms-summary-number">
                  {rooms.length}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="rooms-summary">
                <div className="rooms-summary-label">
                  Available Rooms
                </div>
                <div className="rooms-summary-number">
                  {availableRooms}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="rooms-summary">
                <div className="rooms-summary-label">
                  Full Rooms
                </div>
                <div className="rooms-summary-number">
                  {fullRooms}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rooms-message">
            Loading room details...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {/* Room Cards */}
        {!loading && !error && (
          <div className="row g-4">

            {rooms.map((room) => (
              <div
                className="col-md-6 col-lg-4"
                key={room.room_id}
              >
                <div className="room-card">

                  <div className="room-card-top">
                    <div>
                      <h5 className="room-number">
                        Room {room.room_number}
                      </h5>
                      <small className="text-muted">
                        Hostel Accommodation
                      </small>
                    </div>

                    <div className="room-icon">
                      🛏️
                    </div>
                  </div>

                  <div className="room-card-body">

                    <p className="room-hostel">
                      🏢 {room.hostel_name}
                    </p>

                    <div className="room-detail">
                      <span className="room-detail-label">
                        Room Capacity
                      </span>
                      <span className="room-detail-value">
                        {room.capacity} Students
                      </span>
                    </div>

                    <div className="room-detail">
                      <span className="room-detail-label">
                        Monthly Fee
                      </span>
                      <span className="room-detail-value">
                        ₹{Number(room.monthly_fee).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="room-detail">
                      <span className="room-detail-label">
                        Availability
                      </span>

                      <span className={`room-status status-${room.status}`}>
                        {room.status}
                      </span>
                    </div>

                  </div>
                </div>
              </div>
            ))}

            {rooms.length === 0 && (
              <div className="col-12">
                <div className="rooms-message">
                  No rooms have been added yet.
                </div>
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}

export default Rooms;

