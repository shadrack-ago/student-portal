const express = require('express');
const mysql = require('mysql2');
const app = express();

// Middleware
app.use(express.json());

// Database connection (TESTED AND WORKING)
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456789", // Your MySQL password
  database: "student_portal"
});

// ==================== CRUD OPERATIONS ====================

// 1. CREATE Student (POST)
app.post('/students', (req, res) => {
  const { first_name, last_name, email, enrollment_date, major, gpa } = req.body;

  // Validation
  if (!first_name || !last_name || !email || !enrollment_date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `INSERT INTO students 
    (first_name, last_name, email, enrollment_date, major, gpa) 
    VALUES (?, ?, ?, ?, ?, ?)`;
  
  const values = [first_name, last_name, email, enrollment_date, major, gpa];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("CREATE Error:", err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: "Email already exists" });
      }
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({
      student_id: result.insertId,
      ...req.body
    });
  });
});

// 2. READ All Students (GET)
app.get('/students', (req, res) => {
  const sql = "SELECT * FROM students";
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("READ All Error:", err);
      return res.status(500).json({ error: "Failed to fetch students" });
    }
    res.json(results);
  });
});

// 3. READ Single Student (GET)
app.get('/students/:id', (req, res) => {
  const sql = "SELECT * FROM students WHERE student_id = ?";
  
  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error("READ Single Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(results[0]);
  });
});

// 4. UPDATE Student (PUT)
app.put('/students/:id', (req, res) => {
  const { first_name, last_name, email, major, gpa } = req.body;
  const sql = `UPDATE students SET 
    first_name = ?, last_name = ?, email = ?, major = ?, gpa = ? 
    WHERE student_id = ?`;
  
  const values = [first_name, last_name, email, major, gpa, req.params.id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("UPDATE Error:", err);
      return res.status(500).json({ error: "Update failed" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Student updated successfully" });
  });
});

// 5. DELETE Student (DELETE)
app.delete('/students/:id', (req, res) => {
  const sql = "DELETE FROM students WHERE student_id = ?";
  
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error("DELETE Error:", err);
      return res.status(500).json({ error: "Delete failed" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Student deleted successfully" });
  });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`CRUD API running on http://localhost:${PORT}`);
});