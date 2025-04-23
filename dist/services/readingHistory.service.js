import readingHistoryRepository from "../repositories/readingHistory.repository.js";
import { notFoundError, unauthorizedError } from "../Errors/appError.js";
import { validateUser } from "../helpers/authHelper.js";
import { capitalizeWords } from "../helpers/stringHelper.js";
import { checkAuthorization } from "../helpers/userHelper.js";
class ReadingHistoryService {
  async createReadingHistory(data, user) {
    return await readingHistoryRepository.create({
      ...data,
      user_id: data.user_id || user.id
    });
  }
  async getAllReadingHistories() {
    return await readingHistoryRepository.findAll();
  }
  async getReadingHistoryById(id) {
    const history = await readingHistoryRepository.findById(id);
    if (!history) {
      throw notFoundError("Reading history not found.");
    }
    return history;
  }
  async updateReadingHistory(id, data, user) {
    const history = await readingHistoryRepository.findById(id);
    if (!history) {
      throw notFoundError("Reading history not found.");
    }
    checkAuthorization(user, history.user_id); // Admin or owner

    if (data.name) {
      data.name = capitalizeWords(data.name);
    }
    const updated = await readingHistoryRepository.update(id, data);
    if (!updated) {
      throw notFoundError("Failed to update reading history.");
    }
    return updated;
  }
  async deleteReadingHistory(id, user) {
    const history = await readingHistoryRepository.findById(id);
    if (!history) {
      throw notFoundError("Reading history not found.");
    }
    checkAuthorization(user, history.user_id);
    return await readingHistoryRepository.delete(id);
  }
}
export default new ReadingHistoryService();