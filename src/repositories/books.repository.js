import connectToDatabase from '../../db.js';

class BooksRepository {
    async create(book) {
        const db = await connectToDatabase();
        const sql = `INSERT INTO books (title, author, genre, form, cover_url, status, owner_type, owner_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await db.execute(sql, [
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
        const db = await connectToDatabase();
        const [rows] = await db.execute("SELECT * FROM books");
        return rows;
    }

    async findById(id) {
        const db = await connectToDatabase();
        const [rows] = await db.execute("SELECT * FROM books WHERE id = ?", [id]);
        return rows[0] || null;
    }

    async update(id, bookData) {
        const db = await connectToDatabase();
        const fields = Object.keys(bookData).map(key => `${key} = ?`).join(', ');
        const values = Object.values(bookData);
        values.push(id);
        await db.execute(`UPDATE books SET ${fields} WHERE id = ?`, values);
    
        // Return the updated book
        const [rows] = await db.execute("SELECT * FROM books WHERE id = ?", [id]);
        return rows[0] || null;
    }
    

    async delete(id) {
        const db = await connectToDatabase();
    
        // First, delete references in all related tables
        await db.execute("DELETE FROM bookshelves WHERE book_id = ?", [id]);
        await db.execute("DELETE FROM reading_history WHERE book_id = ?", [id]);
    
        // Then, delete the book
        const [result] = await db.execute("DELETE FROM books WHERE id = ?", [id]);
    
        return result.affectedRows > 0;
    }
    
    
}
export default new BooksRepository();
