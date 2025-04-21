import readingHistoryRepository from "../repositories/readingHistory.repository.js";
import { notFoundError, forbiddenError, unauthorizedError } from "../Errors/appError.js";

class ReadingHistoryService {
    async createReadingHistory(data, user) {
        try {
           // if (!user) {
             //   throw new UnauthorizedError("User must be logged in to create reading history.");
            //}

            return await readingHistoryRepository.create({ ...data, user_id: data.user_id });
        } catch (error) {
            console.error("Error in createReadingHistory:", error);
            throw error;
        }
    }

    async getAllReadingHistories() {
        try {
            const result = await readingHistoryRepository.findAll();
            console.log("Reading histories fetched: ", result); // Log the result
            return result;
        } catch (error) {
            console.error("Error in getAllReadingHistories:", error);
            throw error;
        }
    }
    

    async getReadingHistoryById(id) {
        try {
            const history = await readingHistoryRepository.findById(id);
            if (!history) {
                throw new notFoundError("Reading history not found.");
            }
            return history;
        } catch (error) {
            console.error("Error in getReadingHistoryById:", error);
            throw error;
        }
    }
  
            async updateReadingHistory(id, data, user) {
                try {
                    const history = await readingHistoryRepository.findById(id);
                    if (!history) {
                        throw new notFoundError("Reading history not found.");
                    }
            // if (!user || (user.role !== "admin" && user.id !== history.userId)) {
             //   throw new ForbiddenError("You are not allowed to update this reading history.");
            //}
                    if (data.name) {
                        data.name = this.capitalizeName(data.name);
                    }
            
                    const updatedHistory = await readingHistoryRepository.update(id, data); // Fetch the updated history from the repository
                    if (!updatedHistory) {
                        throw new notFoundError("Failed to update reading history.");
                    }
            
                    return updatedHistory; // Return the updated reading history object
                } catch (error) {
                    console.error("Error in updateReadingHistory:", error);
                    throw error;
                }
            }
            
    async deleteReadingHistory(id, user) {
        try {
            const history = await readingHistoryRepository.findById(id);
            if (!history) {
                throw new notFoundError("Reading history not found.");
            }

        //    if (!user || (user.role !== "admin" && user.id !== history.userId)) {
          //      throw new ForbiddenError("You are not allowed to delete this reading history.");
       //     }

            return await readingHistoryRepository.delete(id);
        } catch (error) {
            console.error("Error in deleteReadingHistory:", error);
            throw error;
        }
    }

    capitalizeName(name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }
}

export default new ReadingHistoryService();
