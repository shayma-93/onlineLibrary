import express from "express"
import readingHistoryController from "../controllers/readingHistory.controller.js"

const router = express.Router();

router.post("/", readingHistoryController.createReadingHistory);
router.get("/", readingHistoryController.getAllReadingHistories);
router.get("/:id", readingHistoryController.getReadingHistoryById);
router.put("/:id", readingHistoryController.updateReadingHistory);
router.delete("/:id", readingHistoryController.deleteReadingHistory);

export default router;
