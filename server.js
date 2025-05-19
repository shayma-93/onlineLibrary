import app from "./routing.js";
import { pool } from "./db.js";
import dotenv from 'dotenv';
import cors from "cors";


dotenv.config();

const PORT = process.env.PORT || 5000;
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  testDB();
});


const testDB = async () => {
  try {
    // Use the connection pool to execute a simple query
    const [rows] = await pool.query("SHOW TABLES");

    const tableNames = rows.map(row => Object.values(row)[0]);
    console.log("Connected to DB. Tables:", tableNames);
  } catch (err) {
    console.error("DB connection failed:", err.message);
  }
}