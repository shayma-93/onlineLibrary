import libraryCardService from "../services/libraryCard.service.js";
import { notFoundError, forbiddenError, badRequestError } from "../Errors/appError.js";
import { handleError, handleSuccess } from "../Errors/handleErrors.js";
import { validateRequiredFields, validateUser } from "../helpers/authHelper.js";
class LibraryCardController {
  async createLibraryCard(req, res) {
    const validationError = validateRequiredFields(req.body, ["user_id"]);
    if (validationError) {
      return handleError(res, badRequestError(validationError.error));
    }
    if (!validateUser(req, res)) return;
    try {
      const libraryCard = await libraryCardService.createLibraryCard(req.body, req.user);
      handleSuccess(res, libraryCard, "Library card created successfully", 201);
    } catch (error) {
      handleError(res, error);
    }
  }
  async getAllLibraryCards(req, res) {
    try {
      const libraryCards = await libraryCardService.getAllLibraryCards();
      handleSuccess(res, libraryCards);
    } catch (error) {
      handleError(res, error);
    }
  }
  async getLibraryCardById(req, res) {
    try {
      const card = await libraryCardService.getLibraryCardById(req.params.id, req.user);
      handleSuccess(res, card);
    } catch (error) {
      handleError(res, error);
    }
  }
  async updateLibraryCard(req, res) {
    if (!validateUser(req, res)) return;
    try {
      const updatedLibraryCard = await libraryCardService.updateLibraryCard(req.params.id, req.body, req.user);
      if (!updatedLibraryCard) {
        throw notFoundError("Library card not found or update failed");
      }
      handleSuccess(res, updatedLibraryCard, "Library card updated successfully");
    } catch (error) {
      handleError(res, error);
    }
  }
  async deleteLibraryCard(req, res) {
    if (!validateUser(req, res)) return;
    try {
      const deleted = await libraryCardService.deleteLibraryCard(req.params.id, req.user);
      if (!deleted) {
        throw notFoundError("Library card not found or delete failed");
      }
      handleSuccess(res, null, "Library card deleted successfully");
    } catch (error) {
      handleError(res, error);
    }
  }
}
export default new LibraryCardController();