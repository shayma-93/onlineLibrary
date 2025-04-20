import connectToDatabase from "../../db.js";

class UsersRepository {
    async create(user) {
        const db = await connectToDatabase();
        const sql = `
            INSERT INTO users (username, first_name, last_name, age, email, password_hash)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(sql, [
            user.username,
            user.first_name,
            user.last_name,
            user.age,
            user.email,
            user.password_hash
        ]);

        return { id: result.insertId, ...user };
    }

    async findAll() {
        const db = await connectToDatabase();
        const [rows] = await db.execute("SELECT * FROM users");
        return rows;
    }

    async findById(id) {
        const db = await connectToDatabase();
        const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
        return rows[0] || null;
    }

    async update(id, updatedData) {
        const db = await connectToDatabase();
        const fields = Object.keys(updatedData).map(key => `${key} = ?`).join(", ");
        const values = Object.values(updatedData);
        values.push(id);

        const [result] = await db.execute(`UPDATE users SET ${fields} WHERE id = ?`, values);
        return result.affectedRows > 0;
    }

    async delete(id) {
        const db = await connectToDatabase();
        const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);
        return result.affectedRows > 0;
    }
}

export default new UsersRepository();
