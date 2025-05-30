import { pool } from "../../db.js";
import { createError } from "../Errors/appError.js";
class ReadingHistoryRepository {
  // Create a new reading history
  async create(entry) {
    const startedAt = new Date(entry.started_at).toISOString().slice(0, 19).replace('T', ' ');
    const finishedAt = new Date(entry.finished_at).toISOString().slice(0, 19).replace('T', ' ');
    const sql = `
            INSERT INTO reading_history (user_id, book_id, started_at, finished_at, rating)
            VALUES (?, ?, ?, ?, ?) `;
    try {
      const [result] = await pool.execute(sql, [entry.user_id, entry.book_id, startedAt, finishedAt, entry.rating]);
      return {
        id: result.insertId,
        ...entry
      };
    } catch (error) {
      console.error("Error in ReadingHistoryRepository.create:", error.message);
      throw new createError("Failed to create reading history. Please check the input data.", 500);
    }
  }

  // Fetch all reading histories
  async findAll() {
    const sql = "SELECT * FROM reading_history";
    try {
      const [rows] = await pool.execute(sql);
      return rows || [];
    } catch (error) {
      console.error("Error in ReadingHistoryRepository.findAll:", error.message);
      throw new createError("Failed to fetch reading histories. Please try again later.", 500);
    }
  }

  // Fetch a specific reading history by ID
  async findById(id) {
    const sql = "SELECT * FROM reading_history WHERE id = ?";
    try {
      const [rows] = await pool.execute(sql, [id]);
      if (rows.length === 0) {
        return null;
      }
      return rows[0];
    } catch (error) {
      console.error("Error in ReadingHistoryRepository.findById:", error.message);
      throw new createError("Failed to fetch reading history by ID. Please try again later.", 500);
    }
  }
  // Update a specific reading history
  async update(id, updatedData) {
    // Convert started_at and finished_at to MySQL compatible format if present
    if (updatedData.started_at) {
      updatedData.started_at = new Date(updatedData.started_at).toISOString().slice(0, 19).replace('T', ' ');
    }
    if (updatedData.finished_at) {
      updatedData.finished_at = new Date(updatedData.finished_at).toISOString().slice(0, 19).replace('T', ' ');
    }
    const fields = Object.keys(updatedData).map(key => `${key} = ?`).join(", ");
    const values = Object.values(updatedData);
    values.push(id);
    const sql = `UPDATE reading_history SET ${fields} WHERE id = ?`;
    try {
      const [result] = await pool.execute(sql, values);
      if (result.affectedRows > 0) {
        // Fetch and return the updated reading history
        const updatedHistory = await this.findById(id);
        return updatedHistory;
      } else {
        return null; // No rows affected, meaning the update failed
      }
    } catch (error) {
      console.error("Error in ReadingHistoryRepository.update:", error.message);
      throw new createError("Failed to update reading history. Please try again later.", 500);
    }
  }

  // Delete a reading history by ID
  async delete(id) {
    const sql = "DELETE FROM reading_history WHERE id = ?";
    try {
      const [result] = await pool.execute(sql, [id]);
      return result.affectedRows > 0; // Return true if the delete was successful
    } catch (error) {
      console.error("Error in ReadingHistoryRepository.delete:", error.message);
      throw new createError("Failed to delete reading history. Please try again later.", 500);
    }
  }
}
export default new ReadingHistoryRepository();