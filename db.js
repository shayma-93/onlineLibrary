import mysql from 'mysql2/promise';

const connectToDatabase = async () => {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',          // or your MySQL host
    user: 'root',    // your MySQL username
    password: 'YourPassword123!',  // your MySQL password
    database: 'library',  // your MySQL database name
  });
  return connection;
};

export default connectToDatabase;
