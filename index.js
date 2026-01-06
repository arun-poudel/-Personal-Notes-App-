import express from "express";
import dotenv from "dotenv";
import pool, { initDB } from "./db.js";
import { count } from "console";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// initialize Database

initDB();

app.post("/notes", async (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "title and content are required" });
  }

  try {
    const queryText = `
    INSERT INTO notes (title , content , category)
    VALUES ($1, $2, $3)
    RETURNING *; 
    `;

    const values = [title, content, category || "General"];
    const result = await pool.query(queryText, values);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get notes (with Search , Filter, and Pagination)

app.get("/notes", async (req, res) => {
  try {
    let { search, category, page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;
    let queryText = "SELECT * FROM notes WHERE 1=1";
    let values = [];
    let placeholderIdx = 1;

    // Add search functionality

    if (search) {
      queryText += ` AND (title ILIKE $${placeholderIdx} OR content ILIKE $${placeholderIdx})`;
      values.push(`%${search}%`);
      placeholderIdx++;
    }

    // Add category Filter

    if (category) {
      queryText += ` AND category = $${placeholderIdx}`;
      values.push(category);
      placeholderIdx++;
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${placeholderIdx} OFFSET $${
      placeholderIdx + 1
    }`;
    values.push(limit, offset);

    const result = await pool.query(queryText, values);
    res.json({
      page: parseInt(page),
      count: result.rowCount,
      notes: result.rows,
    });
  } catch (err) {
    console.error();
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 3. Update a Note
app.put("/notes/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content, category } = req.body;

  try {
    const queryText = `
      UPDATE notes 
      SET title = $1, 
          content = $2, 
          category = $3, 
          updated_at = CURRENT_TIMESTAMP  -- This is the key logic!
      WHERE id = $4 
      RETURNING *;
    `;

    const values = [title, content, category, id];
    const result = await pool.query(queryText, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(` server has started at http://localhost/${PORT}`);
});
