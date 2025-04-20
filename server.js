// server.js
import app from "./routing.js";
import connectToDatabase from "./db.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  testDB(); 
});

const testDB = async () => {
  try {
    const db = await connectToDatabase();

    // Use MySQL syntax and .query instead of .all
    const [rows] = await db.query("SHOW TABLES");

    // Extract table names from result
    const tableNames = rows.map(row => Object.values(row)[0]);
    console.log("Connected to DB. Tables:", tableNames);
  } catch (err) {
    console.error("DB connection failed:", err.message);
  }
};
