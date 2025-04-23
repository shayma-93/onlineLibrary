import booksService from '../services/books.service.js';
import { validateUser, validateRequiredFields } from '../helpers/authHelper.js';
import { handleError, handleSuccess } from "../Errors/handleErrors.js";
import { badRequestError, notFoundError } from "../Errors/appError.js";
class BooksController {
  async createBook(req, res) {
    if (!validateUser(req, res)) return;
    const validationError = validateRequiredFields(req.body, ["title", "author", "genre"]);
    if (validationError) {
      return handleError(res, badRequestError(validationError.error));
    }
    try {
      const bookData = {
        ...req.body,
        owner_id: req.user.id,
        owner_type: req.user.role
      };
      const book = await booksService.createBook(bookData);
      handleSuccess(res, book, "Book created successfully", 201);
    } catch (error) {
      handleError(res, error);
    }
  }
  async getAllBooks(req, res) {
    try {
      const books = await booksService.getAllBooks();
      handleSuccess(res, books);
    } catch (error) {
      handleError(res, error);
    }
  }
  async getBookById(req, res) {
    try {
      const book = await booksService.getBookById(req.params.id);
      if (!book) {
        throw notFoundError("Book not found");
      }
      handleSuccess(res, book);
    } catch (error) {
      handleError(res, error);
    }
  }
  async updateBook(req, res) {
    if (!validateUser(req, res)) return;
    try {
      const updatedBook = await booksService.updateBook(req.params.id, req.body, req.user);
      if (!updatedBook) {
        throw notFoundError("Book not found or update failed");
      }
      handleSuccess(res, updatedBook, "Book updated successfully");
    } catch (error) {
      handleError(res, error);
    }
  }
  async deleteBook(req, res) {
    if (!validateUser(req, res)) return;
    try {
      const deleted = await booksService.deleteBook(req.params.id, req.user);
      if (!deleted) {
        throw notFoundError("Book not found or delete failed");
      }
      handleSuccess(res, null, "Book deleted successfully");
    } catch (error) {
      handleError(res, error);
    }
  }
}
export default new BooksController();