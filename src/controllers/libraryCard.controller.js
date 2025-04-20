import libraryCardService from "../services/libraryCard.service.js";

class LibraryCardController {
    async createLibraryCard(req, res) {
        try {
            const libraryCard = await libraryCardService.createLibraryCard(req.body, req.user); // Pass user
            res.status(201).json(libraryCard);
        } catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }

    async getAllLibraryCards(req, res) {
        try {
            const libraryCards = await libraryCardService.getAllLibraryCards();
            res.json(libraryCards);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getLibraryCardById(req, res) {
        try {
            const libraryCard = await libraryCardService.getLibraryCardById(req.params.id);
            res.json(libraryCard);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async updateLibraryCard(req, res) {
        try {
            const updatedLibraryCard = await libraryCardService.updateLibraryCard(req.params.id, req.body, req.user); // Pass user
            res.json(updatedLibraryCard);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async deleteLibraryCard(req, res) {
        try {
            const deletedLibraryCard = await libraryCardService.deleteLibraryCard(req.params.id, req.user); // Pass user
            res.json({ message: "Library card deleted successfully" });
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}

export default new LibraryCardController();
