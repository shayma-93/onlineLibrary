import { pool } from "../../db.js";

class UsersRepository {
  async create(user) {
    const sql = `
      INSERT INTO users (username, first_name, last_name, age, email, password_hash, role)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
      user.username,
      user.first_name,
      user.last_name,
      user.age,
      user.email,
      user.password_hash,
      user.role
    ]);
    return { id: result.insertId, ...user };
  }

  async findAll() {
    const [rows] = await pool.execute("SELECT * FROM users");
    return rows;
  }

  async findByEmail(email) {
    const [rows] = await pool.query("SELECT id, email, password_hash, username, role FROM users WHERE email = ?", [email]);
    return rows[0] || null;
  }

  async findById(id) {
    const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0] || null;
  }

  async update(id, updatedData) {
    const fields = Object.keys(updatedData).map(key => `${key} = ?`).join(", ");
    const values = [...Object.values(updatedData), id];

    const [result] = await pool.execute(`UPDATE users SET ${fields} WHERE id = ?`, values);
    return result.affectedRows > 0;
  }

  async delete(id) {
    const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }
}

export default new UsersRepository();
