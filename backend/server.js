// backend/server.js
import 'dotenv/config'; 
import express from 'express';
import pg from 'pg';


const { Pool } = pg;

const app = express();
const port = process.env.PORT || 3000;


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware pour parser le JSON
app.use(express.json());


app.get('/status', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

app.get('/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});