import bookShelvesService from "../services/bookShelves.service.js";
import { NotFoundError, ForbiddenError } from "../appError.js";  

class BookShelvesController {
    async createBookShelf(req, res) {
        try {
            const bookShelf = await bookShelvesService.createBookShelves(req.body, req.user);
            res.status(201).json(bookShelf);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async getAllBookShelves(req, res) {
        try {
            const bookShelves = await bookShelvesService.getAllBookShelvess();
            res.json(bookShelves);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async getBookShelfById(req, res) {
        try {
            const bookShelf = await bookShelvesService.getBookShelvesById(req.params.id);
            res.json(bookShelf);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async updateBookShelf(req, res) {
        try {
            console.log("🪵 Params ID:", req.params.id);
            console.log("🪵 Request body:", req.body);
    
            const updatedBookShelf = await bookShelvesService.updateBookShelves(req.params.id, req.body);
    
            if (updatedBookShelf) {
                res.json({
                    message: "Bookshelf updated successfully",
                    updatedBookShelf: updatedBookShelf,
                });
            } else {
                res.status(400).json({ error: "Failed to update Bookshelf" });
            }
        } catch (error) {
            console.error("❌ Error in controller:", error);
    
            if (error instanceof NotFoundError) {
                res.status(404).json({ error: error.message });
            } else if (error instanceof ForbiddenError) {
                res.status(403).json({ error: error.message });
            } else {
                res.status(500).json({ error: "An unexpected error occurred" });
            }
        }
    }
    
    

    async deleteBookShelf(req, res) {
        try {
            await bookShelvesService.deleteBookShelves(req.params.id);
            res.json({ message: "BookShelf deleted successfully" });
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}

export default new BookShelvesController();
