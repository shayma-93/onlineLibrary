import bookShelvesRepository from "../repositories/bookShelves.repository.js";
import { NotFoundError, ForbiddenError, UnauthorizedError } from "../appError.js";

class BookShelvesService {
    async createBookShelves(bookShelvesData, user) {
        try {
           /* if (!user || !user.isAdmin) {
                throw new UnauthorizedError("Only admins can create bookshelves.");
            }*/
            return await bookShelvesRepository.create(bookShelvesData);
        } catch (error) {
            console.error("Error in createBookShelves:", error);
            throw error;
        }
    }

    async getAllBookShelvess() {
        try {
            return await bookShelvesRepository.findAll();
        } catch (error) {
            console.error("Error in getAllBookShelvess:", error);
            throw error;
        }
    }

    async getBookShelvesById(id) {
        try {
            const shelf = await bookShelvesRepository.findById(id);
            if (!shelf) {
                throw new NotFoundError("Bookshelf not found");
            }
            return shelf;
        } catch (error) {
            console.error("Error in getBookShelvesById:", error);
            throw error;
        }
    }async updateBookShelves(id, bookShelvesData) {
        try {
            if (!bookShelvesData || typeof bookShelvesData !== 'object') {
                console.error("🚫 Invalid bookShelvesData:", bookShelvesData);
                throw new Error("No data provided to update bookshelf");
            }
    
            const shelf = await bookShelvesRepository.findById(id);
            if (!shelf) {
                throw new NotFoundError("Bookshelf not found");
            }
    
            // Optional capitalization
            if (bookShelvesData.shelf_name) {
                bookShelvesData.shelf_name = this.capitalizeName(bookShelvesData.shelf_name);
            }
    
            const updated = await bookShelvesRepository.update(id, bookShelvesData);
    
            if (updated) {
                return await bookShelvesRepository.findById(id);
            }
    
            return null;
        } catch (error) {
            console.error("❌ Error in updateBookShelves:", error);
            throw error;
        }
    }
    
    

    async deleteBookShelves(id) {
        try {
            const shelf = await bookShelvesRepository.findById(id);
            if (!shelf) {
                throw new NotFoundError("Bookshelf not found");
            }
            return await bookShelvesRepository.delete(id);
        } catch (error) {
            console.error("Error in deleteBookShelves:", error);
            throw error;
        }
    }

    capitalizeName(name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }
}

export default new BookShelvesService();
