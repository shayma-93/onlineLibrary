import express from "express";
import bookShelvesController from "../controllers/bookShelves.controller.js";
import authMiddleware from "../authMiddWare.js";

const router = express.Router();

router.post("/", authMiddleware, bookShelvesController.createBookShelf);
router.get("/", authMiddleware, bookShelvesController.getAllBookShelves);
router.get("/:id", authMiddleware, bookShelvesController.getBookShelvesById);
router.get("/users/:userId/shelves", authMiddleware, bookShelvesController.getBookShelvesByUser);
router.put("/:id", authMiddleware, bookShelvesController.updateBookShelf);
router.delete("/:id", authMiddleware, bookShelvesController.deleteBookShelf);

export default router;
