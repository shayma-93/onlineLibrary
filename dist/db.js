import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: '127.0.0.1',           // your MySQL host
  user: 'root',                // your MySQL username
  password: 'YourPassword123!',// your MySQL password
  database: 'library',         // your MySQL database name
});
