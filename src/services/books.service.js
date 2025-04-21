import booksRepository from "../repositories/books.repository.js";
import { notFoundError, forbiddenError, unauthorizedError } from "../Errors/appError.js";

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
        throw new notFoundError("Book not found");
      }
      return book;
    } catch (error) {
      console.error("Error in getBookById:", error);
      throw error;
    }
  }

  async deleteBook(id) {
    try {
      const book = await booksRepository.findById(id);
      if (!book) {
        throw new notFoundError("Book not found");
      }
      return await booksRepository.delete(id);
    } catch (error) {
      console.error("Error in deleteBook:", error);
      throw error;
    }
  }

  async updateBook(id, data) {
    const book = await booksRepository.findById(id);
    if (!book) {
        throw new notFoundError("Book not found");
    }

    if (data.forbiddenField) {
        throw new forbiddenError("You are not allowed to update this field");
    }

    return await booksRepository.update(id, data); // This now returns the updated book
}

}

export default new BooksService();
