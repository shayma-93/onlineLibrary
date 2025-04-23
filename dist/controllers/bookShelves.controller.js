import bookShelvesService from "../services/bookShelves.service.js";
import { notFoundError, forbiddenError, badRequestError } from "../Errors/appError.js";
import { handleError, handleSuccess } from "../Errors/handleErrors.js";
import { validateRequiredFields, validateUser } from "../helpers/authHelper.js";
class BookShelvesController {
  async createBookShelf(req, res) {
    const validationError = validateRequiredFields(req.body, ["user_id", "book_id", "shelf_name"]);
    if (validationError) {
      return handleError(res, badRequestError(validationError.error));
    }
    if (!validateUser(req, res)) return;
    try {
      const bookShelf = await bookShelvesService.createBookShelves(req.body, req.user);
      handleSuccess(res, bookShelf, "Bookshelf created successfully", 201);
    } catch (error) {
      handleError(res, error);
    }
  }
  async getAllBookShelves(req, res) {
    try {
      const bookShelves = await bookShelvesService.getAllBookShelves();
      handleSuccess(res, bookShelves);
    } catch (error) {
      handleError(res, error);
    }
  }
  async getBookShelvesByUser(req, res) {
    try {
      const bookShelves = await bookShelvesService.getBookShelvesByUser(req.params.userId);
      if (!bookShelves || bookShelves.length === 0) {
        throw notFoundError("No bookshelves found for this user");
      }
      handleSuccess(res, bookShelves);
    } catch (error) {
      handleError(res, error);
    }
  }
  async getBookShelvesById(req, res) {
    try {
      const bookShelf = await bookShelvesService.getBookShelvesById(req.params.id);
      if (!bookShelf) {
        throw notFoundError("No bookshelf found");
      }
      handleSuccess(res, bookShelf);
    } catch (error) {
      handleError(res, error);
    }
  }
  async updateBookShelf(req, res) {
    if (!validateUser(req, res)) return;
    try {
      const updatedBookShelf = await bookShelvesService.updateBookShelves(req.params.id, req.body, req.user);
      if (!updatedBookShelf) {
        throw notFoundError("Bookshelf not found or update failed");
      }
      handleSuccess(res, updatedBookShelf, "Bookshelf updated successfully");
    } catch (error) {
      handleError(res, error);
    }
  }
  async deleteBookShelf(req, res) {
    if (!validateUser(req, res)) return;
    try {
      const deleted = await bookShelvesService.deleteBookShelves(req.params.id, req.user);
      if (!deleted) {
        throw notFoundError("Bookshelf not found or delete failed");
      }
      handleSuccess(res, null, "Bookshelf deleted successfully");
    } catch (error) {
      handleError(res, error);
    }
  }
}
export default new BookShelvesController();