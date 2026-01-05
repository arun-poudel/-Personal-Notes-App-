import express from "express";
import dotenv from "dotenv";
import pool, { initDB } from "./db.js";


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

app.listen(PORT, () => {
  console.log(` server has started at http://localhost/${PORT}`);
});
