import express from "express";
import booksController from "../controllers/books.controller.js";

const router = express.Router();

router.post("/", booksController.createBook);
router.get("/", booksController.getAllBooks);
router.get("/:id", booksController.getBookById);
router.put("/:id", booksController.updateBook);
router.delete("/:id", booksController.deleteBook);

export default router;
