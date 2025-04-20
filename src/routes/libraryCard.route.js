import express from "express"
import libraryCardController from "../controllers/libraryCard.controller.js"

const router = express.Router();

router.post("/", libraryCardController.createLibraryCard);
router.get("/", libraryCardController.getAllLibraryCards);
router.get("/:id", libraryCardController.getLibraryCardById);
router.put("/:id", libraryCardController.updateLibraryCard);
router.delete("/:id", libraryCardController.deleteLibraryCard);

export default router;
