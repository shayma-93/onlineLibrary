import express from "express";
import booksController from "../controllers/books.controller.js";
import authMiddleware from "../authMiddWare.js";

const router = express.Router();

// Public route – no authMiddleware
router.get("/", booksController.getAllBooks);
router.get("/:id", booksController.getBookById);

// Protected routes – require JWT
router.post("/", authMiddleware, booksController.createBook);
router.put("/:id", authMiddleware, booksController.updateBook);
router.delete("/:id", authMiddleware, booksController.deleteBook);

export default router;
