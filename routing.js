import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import booksRoutes from "./src/routes/books.route.js";
import usersRoutes from "./src/routes/users.route.js";
import bookShelvesRoutes from "./src/routes/bookShelves.route.js";
import libraryCardRoutes from "./src/routes/libraryCard.route.js";
import readingHistoryRoutes from "./src/routes/readingHistory.route.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use((req, res, next) => {
  console.log("Global middleware hit. res.cookie?", typeof res.cookie);
  next();
});

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
  res.status(err.statusCode || 500).json({ error: err.message || "Internal Server Error" });
});

export default app;
