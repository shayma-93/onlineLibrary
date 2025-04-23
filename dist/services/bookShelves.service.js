import bookShelvesRepository from "../repositories/bookShelves.repository.js";
import { notFoundError } from "../Errors/appError.js";
import { checkAuthorization, validateRequiredFields } from "../helpers/authHelper.js";
import { capitalizeWords } from "../helpers/stringHelper.js";
import { pool } from "../../db.js";
class BookShelvesService {
  async createBookShelves(data, user) {
    if (user.id !== data.user_id) {
      throw notFoundError("You can only create bookshelves for yourself.");
    }
    const error = validateRequiredFields(data, ["user_id", "book_id", "shelf_name"]);
    if (error) throw error;
    data.shelf_name = capitalizeWords(data.shelf_name);
    return await bookShelvesRepository.create(data);
  }
  async getAllBookShelves() {
    const sql = `SELECT * FROM bookshelves`;
    const [rows] = await pool.execute(sql);
    return rows;
  }
  async getBookShelvesById(id) {
    const shelf = await bookShelvesRepository.findById(id);
    if (!shelf) throw notFoundError("Bookshelf not found");
    return shelf;
  }
  async getBookShelvesByUser(userId) {
    const shelves = await bookShelvesRepository.findByUserId(userId);
    if (!shelves?.length) throw notFoundError("No bookshelves found for this user");
    return shelves;
  }
  async updateBookShelves(id, data, user) {
    const shelf = await this.getBookShelvesById(id);
    checkAuthorization(user, shelf.user_id);
    if (data.shelf_name) {
      data.shelf_name = capitalizeWords(data.shelf_name);
    }
    await bookShelvesRepository.update(id, data);
    return await this.getBookShelvesById(id);
  }
  async deleteBookShelves(id, user) {
    const shelf = await this.getBookShelvesById(id);
    checkAuthorization(user, shelf.user_id);
    return await bookShelvesRepository.delete(id);
  }
}
export default new BookShelvesService();