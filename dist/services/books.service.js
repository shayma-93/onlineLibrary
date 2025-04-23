import booksRepository from "../repositories/books.repository.js";
import { notFoundError, forbiddenError } from "../Errors/appError.js";
import { checkAuthorization } from "../helpers/authHelper.js";
class BooksService {
  async createBook(bookData) {
    try {
      return await booksRepository.create(bookData);
    } catch (error) {
      console.error("Error in createBook:", error);
      throw error;
    }
  }
  async getAllBooks() {
    try {
      return await booksRepository.findAll();
    } catch (error) {
      console.error("Error in getAllBooks:", error);
      throw error;
    }
  }
  async getBookById(id) {
    try {
      const book = await booksRepository.findById(id);
      if (!book) {
        throw notFoundError("Book not found");
      }
      return book;
    } catch (error) {
      console.error("Error in getBookById:", error);
      throw error;
    }
  }
  async deleteBook(id, currentUser) {
    try {
      const book = await booksRepository.findById(id);
      if (!book) {
        throw notFoundError("Book not found");
      }
      checkAuthorization(currentUser, book.owner_id);
      return await booksRepository.delete(id);
    } catch (error) {
      console.error("Error in deleteBook:", error);
      throw error;
    }
  }
  async updateBook(id, data, currentUser) {
    try {
      const book = await booksRepository.findById(id);
      if (!book) {
        throw notFoundError("Book not found");
      }
      checkAuthorization(currentUser, book.owner_id);
      return await booksRepository.update(id, data);
    } catch (error) {
      console.error("Error in updateBook:", error);
      throw error;
    }
  }
}
export default new BooksService();