import express from "express";
import cors from "cors";
import booksRoutes from "./src/routes/books.route.js";
import usersRoutes from "./src/routes/users.route.js";
import bookShelvesRoutes from "./src/routes/bookShelves.route.js";
import libraryCardRoutes from "./src/routes/libraryCard.route.js";
import readingHistoryRoutes from "./src/routes/readingHistory.route.js";

const app = express();
app.use((req, res, next) => {
  if ((req.method === 'GET' || req.method === 'DELETE') && req.headers['content-type'] === 'application/json') {
      delete req.headers['content-type']; // Prevent express.json() from trying to parse
  }
  next();
});

app.use(express.json()); 

app.use(cors());

app.use("/api/books", booksRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/bookshelves", bookShelvesRoutes);
app.use("/api/librarycards", libraryCardRoutes);
app.use("/api/readinghistory", readingHistoryRoutes);

app.get("/", (req, res) => {
  res.send("📚 Welcome to the Book Library API!");
});

app.use((err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
      error: message,
  });
});

export default app;
