import connectToDatabase from "../../db.js";

class LibraryCardRepository {
    async create(card) {
        const db = await connectToDatabase();
        const sql = `
            INSERT INTO library_cards (user_id, issue_date, expiry_date)
            VALUES (?, ?, ?)
        `;
        const [result] = await db.execute(sql, [
            card.user_id,
            card.issue_date,
            card.expiry_date
        ]);

        return { id: result.insertId, ...card };
    }

    async findAll() {
        const db = await connectToDatabase();
        const [rows] = await db.execute("SELECT * FROM library_cards");
        return rows;
    }

    async findById(id) {
        const db = await connectToDatabase();
        const [rows] = await db.execute("SELECT * FROM library_cards WHERE id = ?", [id]);
        return rows[0] || null;
    }

    async update(id, updatedData) {
        const db = await connectToDatabase();
        const fields = Object.keys(updatedData).map(key => `${key} = ?`).join(", ");
        const values = Object.values(updatedData);
        values.push(id);

        const [result] = await db.execute(`UPDATE library_cards SET ${fields} WHERE id = ?`, values);
        return result.affectedRows > 0;
    }

    async delete(id) {
        const db = await connectToDatabase();
        const [result] = await db.execute("DELETE FROM library_cards WHERE id = ?", [id]);
        return result.affectedRows > 0;
    }
}

export default new LibraryCardRepository();
