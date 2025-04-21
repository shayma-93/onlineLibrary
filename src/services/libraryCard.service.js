import libraryCardRepository from "../repositories/libraryCard.repository.js";
import { notFoundError, forbiddenError, unauthorizedError } from "../Errors/appError.js";

class LibraryCardService {
    async createLibraryCard(libraryCardData, user) {
        try {
           // if (!user || !user.isAdmin) {
             //   throw new UnauthorizedError("Only admins can create library cards");
            //}

            return await libraryCardRepository.create(libraryCardData);
        } catch (error) {
            console.error("Error in createlibraryCard:", error);
            throw error;
        }
    }

    async getAllLibraryCards() {
        try {
            return await libraryCardRepository.findAll();
        } catch (error) {
            console.error("Error in getAllLibraryCards:", error);
            throw error;
        }
    }

    async getLibraryCardById(id) {
        try {
            const card = await libraryCardRepository.findById(id);
            if (!card) {
                throw new notFoundError("Library card not found");
            }
            return card;
        } catch (error) {
            console.error("Error in getLibraryCardById:", error);
            throw error;
        }
    }

    async updateLibraryCard(id, libraryCardData, user) {
        try {
            const card = await libraryCardRepository.findById(id);
            if (!card) {
                throw new notFoundError("Library card not found");
            }

            //if (user.role !== 'admin' && card.user_id !== user.id) {
              //  throw new ForbiddenError("You are not allowed to update this library card");
           // }

            if (libraryCardData.name) {
                libraryCardData.name = this.capitalizeName(libraryCardData.name);
            }

            await libraryCardRepository.update(id, libraryCardData);
            return await libraryCardRepository.findById(id);
                    } catch (error) {
            console.error("Error in updateLibraryCard:", error);
            throw error;
        }
    }

    async deleteLibraryCard(id, user) {
        try {
            const card = await libraryCardRepository.findById(id);
            if (!card) {
                throw new notFoundError("Library card not found");
            }

           // if (user.role !== 'admin' && card.user_id !== user.id) {
             //   throw new ForbiddenError("You are not allowed to delete this library card");
            //}

            return await libraryCardRepository.delete(id);
        } catch (error) {
            console.error("Error in deleteLibraryCard:", error);
            throw error;
        }
    }

    capitalizeName(name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }
}

export default new LibraryCardService();
