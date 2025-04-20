import readingHistoryService from "../services/readingHistory.service.js";

class ReadingHistoryController {
    async createReadingHistory(req, res, next) {
        try {
            const readingHistory = await readingHistoryService.createReadingHistory(req.body, req.user);
            res.status(201).json(readingHistory);
        } catch (error) {
            next(error); // pass error to Express error middleware
        }
    }

    async getAllReadingHistories(req, res, next) {
        try {
            const readingHistories = await readingHistoryService.getAllReadingHistories();
            res.json(readingHistories);
        } catch (error) {
            next(error);
        }
    }

    async getReadingHistoryById(req, res, next) {
        try {
            const readingHistory = await readingHistoryService.getReadingHistoryById(req.params.id);
            res.json(readingHistory);
        } catch (error) {
            next(error);
        }
    }
    async updateReadingHistory(req, res, next) {
        try {
            const updatedHistory = await readingHistoryService.updateReadingHistory(req.params.id, req.body, req.user);
    
            if (updatedHistory) {
                res.status(200).json({
                    message: "Reading history updated successfully.",
                    updatedReadingHistory: updatedHistory // Send the updated reading history as part of the response
                });
            } else {
                res.status(404).json({ error: "Reading history not found or no changes were made." });
            }
        } catch (error) {
            next(error);  // Pass the error to the next middleware (Error handling)
        }
    }
    
    

    async deleteReadingHistory(req, res, next) {
        try {
            await readingHistoryService.deleteReadingHistory(req.params.id, req.user);
            res.json({ message: "Reading history deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
}

export default new ReadingHistoryController();
