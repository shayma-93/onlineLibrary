import connectToDatabase from "../../db.js";

class BookShelvesRepository {
    async create(bookShelf) {
        const db = await connectToDatabase();
        const sql = `INSERT INTO bookshelves (user_id, book_id, shelf_name, description) VALUES (?, ?, ?, ?)`;
        const [result] = await db.execute(sql, [
            bookShelf.user_id,
            bookShelf.book_id,
            bookShelf.shelf_name,
            bookShelf.description,
        ]);
        return { id: result.insertId, ...bookShelf };
    }

    async findAll() {
        const db = await connectToDatabase();
        const [rows] = await db.execute("SELECT * FROM bookshelves");
        console.log("Fetched bookshelves:", rows); 
        return rows;
    }
    

    async findById(id) {
        const db = await connectToDatabase();
        const [rows] = await db.execute("SELECT * FROM bookshelves WHERE id = ?", [id]);
        return rows[0] || null;
    }

    async update(id, updatedData) {
        const db = await connectToDatabase();
        const fields = Object.keys(updatedData).map(key => `${key} = ?`).join(", ");
        const values = Object.values(updatedData);
        values.push(id);
        const [result] = await db.execute(`UPDATE bookshelves SET ${fields} WHERE id = ?`, values);
        return result.affectedRows > 0;
    }

    async delete(id) {
        const db = await connectToDatabase();
        const [result] = await db.execute("DELETE FROM bookshelves WHERE id = ?", [id]);
        return result.affectedRows > 0;
    }
}

export default new BookShelvesRepository();
