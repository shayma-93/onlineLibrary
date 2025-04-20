import express from "express";
import bookShelvesController from "../controllers/bookShelves.controller.js";

const router = express.Router();

router.post("/", bookShelvesController.createBookShelf);
router.get("/", bookShelvesController.getAllBookShelves);
router.get("/:id", bookShelvesController.getBookShelfById);
router.put("/:id", bookShelvesController.updateBookShelf);
router.delete("/:id", bookShelvesController.deleteBookShelf);

export default router;
