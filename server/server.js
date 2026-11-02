
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const pool = require("./db");
const app = express();

// Verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access denied. Please log in."
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) {
      return res.status(403).json({
        message: "Invalid or expired token."
      });
    }

    req.user = user;
    next();
  });
}

// Allow only admin users
function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required."
    });
  }

  next();
}

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to HostelHub API" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", application: "HostelHub" });
});

app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT current_database() AS database"
    );
    res.json({
      status: "Connected",
      database: result.rows[0].database,
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    res.status(500).json({ message: "Database connection failed" });
  }
});

// Student registration
app.post("/api/register", async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        message: "Please fill in all required fields.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await pool.query(
      "SELECT user_id FROM users WHERE LOWER(email) = $1",
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING user_id, full_name, email, role, created_at`,
      [full_name.trim(), normalizedEmail, passwordHash, "student"]
    );

    return res.status(201).json({
      message: "Registration successful!",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    return res.status(500).json({
      message: "Registration failed. Please try again.",
    });
  }
});


app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter your email and password.",
      });
    }

    const result = await pool.query(
      `SELECT user_id, full_name, email, password_hash, role
       FROM users
       WHERE LOWER(email) = LOWER($1)`,
      [email.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const user = result.rows[0];
    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      message: "Login successful!",
      token,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({
      message: "Login failed. Please try again.",
    });
  }
});


// GET: Fetch complaints submitted by the logged-in student
app.get(
  "/api/complaints/:userId",
  authenticateToken,
  async (req, res) => {
    try {
      const { userId } = req.params;

      // Students can only access their own complaints
      if (Number(userId) !== Number(req.user.user_id)) {
        return res.status(403).json({
          message: "You can only view your own complaints."
        });
      }

      const result = await pool.query(
        `SELECT complaint_id, subject, description, status, created_at
         FROM complaints
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [req.user.user_id]
      );

      res.json(result.rows);
    } catch (error) {
      console.error("Fetch complaints error:", error.message);
      res.status(500).json({
        message: "Unable to fetch complaints."
      });
    }
  }
);


// POST: Submit a new complaint
app.post("/api/complaints", async (req, res) => {
  try {
    const { user_id, subject, description } = req.body;

    if (!user_id || !subject?.trim() || !description?.trim()) {
      return res.status(400).json({
        message: "Please fill in all complaint details."
      });
    }

    const result = await pool.query(
      `INSERT INTO complaints (user_id, subject, description, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [user_id, subject.trim(), description.trim(), "pending"]
    );

    res.status(201).json({
      message: "Complaint submitted successfully!",
      complaint: result.rows[0]
    });

  } catch (error) {
    console.error("Submit complaint error:", error.message);
    res.status(500).json({
      message: "Unable to submit complaint."
    });
  }
});


// GET: Fetch leave requests for a student
app.get("/api/leave/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM leave_requests
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Fetch leave requests error:", error.message);
    res.status(500).json({
      message: "Unable to fetch leave requests."
    });
  }
});


// POST: Submit a leave request
app.post("/api/leave", async (req, res) => {
  try {
    const { user_id, reason, from_date, to_date } = req.body;

    if (!user_id || !reason?.trim() || !from_date || !to_date) {
      return res.status(400).json({
        message: "Please fill in all leave request details."
      });
    }

    const result = await pool.query(
      `INSERT INTO leave_requests
       (user_id, reason, from_date, to_date, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, reason.trim(), from_date, to_date, "pending"]
    );

    res.status(201).json({
      message: "Leave request submitted successfully!",
      request: result.rows[0]
    });

  } catch (error) {
    console.error("Submit leave request error:", error.message);
    res.status(500).json({
      message: "Unable to submit leave request."
    });
  }
});


// GET: Fetch all registered students (Admin)
app.get("/api/admin/students", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT user_id, full_name, email, role
       FROM users
       WHERE role = 'student'
       ORDER BY user_id DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Fetch students error:", error.message);
    res.status(500).json({
      message: "Unable to fetch students."
    });
  }
});

 // GET: Fetch all hostel rooms
app.get("/api/rooms", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         rooms.room_id,
         rooms.room_number,
         rooms.capacity,
         rooms.monthly_fee,
         rooms.status,
         hostels.hostel_name
       FROM rooms
       JOIN hostels
       ON rooms.hostel_id = hostels.hostel_id
       ORDER BY rooms.room_number`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Fetch rooms error:", error.message);
    res.status(500).json({
      message: "Unable to fetch hostel rooms."
    });
  }
});

// UPDATE: Change room status (Admin)
app.put("/api/admin/rooms/:roomId/status", authenticateToken,
requireAdmin,async (req, res) => {
  try {
    const { roomId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["available", "full", "maintenance"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid room status."
      });
    }

    const result = await pool.query(
      `UPDATE rooms
       SET status = $1
       WHERE room_id = $2
       RETURNING room_id, room_number, capacity, monthly_fee, status`,
      [status, roomId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Room not found."
      });
    }

    res.json({
      message: "Room status updated successfully!",
      room: result.rows[0]
    });
  } catch (error) {
    console.error("Update room status error:", error.message);
    res.status(500).json({
      message: "Unable to update room status."
    });
  }
});

// GET: Fetch all student complaints (Admin)
app.get("/api/admin/complaints",authenticateToken,
requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         complaints.complaint_id,
         complaints.subject,
         complaints.description,
         complaints.status,
         complaints.created_at,
         users.full_name,
         users.email
       FROM complaints
       JOIN users
       ON complaints.user_id = users.user_id
       ORDER BY complaints.created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Fetch admin complaints error:", error.message);
    res.status(500).json({
      message: "Unable to fetch complaints."
    });
  }
});

// UPDATE: Change complaint status (Admin)
app.put("/api/admin/complaints/:complaintId/status", async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["pending", "in_progress", "resolved"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid complaint status."
      });
    }

    const result = await pool.query(
      `UPDATE complaints
       SET status = $1
       WHERE complaint_id = $2
       RETURNING *`,
      [status, complaintId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Complaint not found."
      });
    }

    res.json({
      message: "Complaint status updated successfully!",
      complaint: result.rows[0]
    });
  } catch (error) {
    console.error("Update complaint status error:", error.message);
    res.status(500).json({
      message: "Unable to update complaint status."
    });
  }
});

 // GET: Fetch all student leave requests (Admin)
app.get("/api/admin/leave",authenticateToken,
requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         leave_requests.request_id,
         leave_requests.reason,
         leave_requests.from_date,
         leave_requests.to_date,
         leave_requests.status,
         leave_requests.created_at,
         users.full_name,
         users.email
       FROM leave_requests
       JOIN users
       ON leave_requests.user_id = users.user_id
       ORDER BY leave_requests.created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Fetch admin leave requests error:", error.message);
    res.status(500).json({
      message: "Unable to fetch leave requests."
    });
  }
});

// UPDATE: Approve or reject a leave request (Admin)
app.put("/api/admin/leave/:requestId/status",authenticateToken,
requireAdmin, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["pending", "approved", "rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid leave request status."
      });
    }

    const result = await pool.query(
      `UPDATE leave_requests
       SET status = $1
       WHERE request_id = $2
       RETURNING *`,
      [status, requestId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Leave request not found."
      });
    }

    res.json({
      message: "Leave request status updated successfully!",
      request: result.rows[0]
    });
  } catch (error) {
    console.error("Update leave request error:", error.message);
    res.status(500).json({
      message: "Unable to update leave request."
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`HostelHub server running on port ${PORT}`);
});
