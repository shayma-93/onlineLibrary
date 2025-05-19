import express from "express";
import bookShelvesController from "../controllers/bookShelves.controller.js";
import authMiddleware from "../authMiddWare.js";

const router = express.Router();
router.get("/", bookShelvesController.getAllBookShelves);
router.get("/:id",  bookShelvesController.getBookShelvesById);

router.post("/", authMiddleware, bookShelvesController.createBookShelf);
router.get("/users/:userId/shelves", authMiddleware, bookShelvesController.getBookShelvesByUser);
router.put("/:id", authMiddleware, bookShelvesController.updateBookShelf);
router.delete("/:id", authMiddleware, bookShelvesController.deleteBookShelf);

export default router;
