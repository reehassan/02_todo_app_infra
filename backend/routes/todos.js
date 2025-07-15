const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'todouser',
  host: process.env.DB_HOST || 'db',
  database: process.env.DB_NAME || 'todoapp',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Input validation middleware
const validateTodo = (req, res, next) => {
  const { text } = req.body;
  
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'Todo text is required and must be a non-empty string' });
  }
  
  if (text.length > 255) {
    return res.status(400).json({ error: 'Todo text must be less than 255 characters' });
  }
  
  req.body.text = text.trim();
  next();
};

// GET all todos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// GET single todo
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching todo:', err);
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
});

// POST new todo
router.post('/', validateTodo, async (req, res) => {
  try {
    const { text } = req.body;
    const result = await pool.query(
      'INSERT INTO todos (text, completed) VALUES ($1, $2) RETURNING *',
      [text, false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating todo:', err);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// PUT update todo
router.put('/:id', validateTodo, async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;
    
    const result = await pool.query(
      'UPDATE todos SET text = $1, completed = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [text, completed !== undefined ? completed : false, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating todo:', err);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// PATCH update todo completion status
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    
    if (completed === undefined) {
      return res.status(400).json({ error: 'Completed status is required' });
    }
    
    const result = await pool.query(
      'UPDATE todos SET completed = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [completed, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating todo completion status:', err);
    res.status(500).json({ error: 'Failed to update todo completion status' });
  }
});

module.exports = router;