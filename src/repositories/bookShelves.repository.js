import { pool } from "../../db.js";
import { internalServerError, badRequestError } from "../Errors/appError.js";

class BookShelvesRepository {
    async create(bookShelf) {
        if (!bookShelf.user_id || !bookShelf.book_id || !bookShelf.shelf_name) {
            throw badRequestError("Missing required fields");
        }

        try {
            const sql = `
                INSERT INTO bookshelves (user_id, book_id, shelf_name, description)
                VALUES (?, ?, ?, ?)
            `;
            const [result] = await pool.execute(sql, [
                bookShelf.user_id,
                bookShelf.book_id,
                bookShelf.shelf_name,
                bookShelf.description,
            ]);

            return { id: result.insertId, ...bookShelf };
        } catch (error) {
            throw internalServerError(`Failed to create bookshelf: ${error.message}`);
        }
    }

    async findAll() {
        try {
            const [rows] = await pool.execute("SELECT * FROM bookshelves");
            return rows;
        } catch (error) {
            throw internalServerError(`Failed to fetch bookshelves: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            const [rows] = await pool.execute("SELECT * FROM bookshelves WHERE id = ?", [id]);
            return rows[0] || null;
        } catch (error) {
            throw internalServerError(`Failed to fetch bookshelf: ${error.message}`);
        }
    }

    async findByUserId(userId) {
        try {
            const [rows] = await pool.execute("SELECT * FROM bookshelves WHERE user_id = ?", [userId]);
            return rows;
        } catch (error) {
            throw internalServerError(`Failed to fetch bookshelves for user: ${error.message}`);
        }
    }

    async update(id, updatedData) {
        if (!updatedData || Object.keys(updatedData).length === 0) {
            throw badRequestError("No data provided for update");
        }

        try {
            const fields = Object.keys(updatedData).map(key => `${key} = ?`).join(", ");
            const values = Object.values(updatedData);
            values.push(id);

            const [result] = await pool.execute(
                `UPDATE bookshelves SET ${fields} WHERE id = ?`,
                values
            );

            return result.affectedRows > 0;
        } catch (error) {
            throw internalServerError(`Failed to update bookshelf: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            const [result] = await pool.execute("DELETE FROM bookshelves WHERE id = ?", [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw internalServerError(`Failed to delete bookshelf: ${error.message}`);
        }
    }
}

export default new BookShelvesRepository();
