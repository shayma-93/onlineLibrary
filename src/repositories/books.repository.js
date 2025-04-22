import { pool } from "../../db.js";

class BooksRepository {
    async create(book) {
        const sql = `INSERT INTO books (title, author, genre, form, cover_url, status, owner_type, owner_id) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await pool.execute(sql, [
            book.title,
            book.author,
            book.genre,
            book.form,
            book.cover_url,
            book.status,
            book.owner_type,
            book.owner_id,
        ]);
        return { id: result.insertId, ...book };
    }

    async findAll() {
        const [rows] = await pool.execute("SELECT * FROM books");
        return rows;
    }

    async findById(id) {
        const [rows] = await pool.execute("SELECT * FROM books WHERE id = ?", [id]);
        return rows[0] || null;
    };
    async update(id, bookData) {

        const fields = Object.keys(bookData).map(key => `${key} = ?`).join(', ');
        const values = Object.values(bookData);
        values.push(id);

        // Update the book in the database
        await pool.execute(`UPDATE books SET ${fields} WHERE id = ?`, values);

        // Return the updated book
        const [rows] = await pool.execute("SELECT * FROM books WHERE id = ?", [id]);
        return rows[0] || null;
    };
    async delete(id) {
        
        // First, delete references in all related tables
        await pool.execute("DELETE FROM bookshelves WHERE book_id = ?", [id]);
        await pool.execute("DELETE FROM reading_history WHERE book_id = ?", [id]);

        // Then, delete the book
        const [result] = await pool.execute("DELETE FROM books WHERE id = ?", [id]);
        return result.affectedRows > 0;
    };
}

export default new BooksRepository();
