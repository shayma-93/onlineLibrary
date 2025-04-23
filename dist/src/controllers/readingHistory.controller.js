import readingHistoryService from "../services/readingHistory.service.js";
import { handleError, handleSuccess } from "../Errors/handleErrors.js";
import { notFoundError } from "../Errors/appError.js";
import { validateUser } from "../helpers/authHelper.js";

class ReadingHistoryController {
    async createReadingHistory(req, res) {
        if (!validateUser(req, res)) return;

        try {
            const readingHistory = await readingHistoryService.createReadingHistory(req.body, req.user);
            handleSuccess(res, readingHistory, "Reading history created successfully", 201);
        } catch (error) {
            handleError(res, error);
        }
    }

    async getAllReadingHistories(req, res) {
        try {
            const readingHistories = await readingHistoryService.getAllReadingHistories();
            handleSuccess(res, readingHistories);
        } catch (error) {
            handleError(res, error);
        }
    }

    async getReadingHistoryById(req, res) {
        try {
            const readingHistory = await readingHistoryService.getReadingHistoryById(req.params.id);
            if (!readingHistory) {
                throw notFoundError("Reading history not found");
            }
            handleSuccess(res, readingHistory);
        } catch (error) {
            handleError(res, error);
        }
    }

    async updateReadingHistory(req, res) {
        if (!validateUser(req, res)) return;

        try {
            const updatedHistory = await readingHistoryService.updateReadingHistory(req.params.id, req.body, req.user);
            if (!updatedHistory) {
                throw notFoundError("Reading history not found or no changes made");
            }
            handleSuccess(res, updatedHistory, "Reading history updated successfully");
        } catch (error) {
            handleError(res, error);
        }
    }

    async deleteReadingHistory(req, res) {
        if (!validateUser(req, res)) return;
        try {
            await readingHistoryService.deleteReadingHistory(req.params.id, req.user);
            handleSuccess(res, null, "Reading history deleted successfully");
        } catch (error) {
            handleError(res, error);
        }
    }
}

export default new ReadingHistoryController();
