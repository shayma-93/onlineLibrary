import booksService from '../services/books.service.js';

class BooksController {
  async createBook(req, res) {
    console.log("Request Body:", req.body);

    try {
      const book = await booksService.createBook(req.body);
      res.status(201).json(book);
    } catch (error) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async getAllBooks(req, res) {
    try {
      const books = await booksService.getAllBooks();
      res.json(books);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getBookById(req, res) {
    try {
      const book = await booksService.getBookById(req.params.id);
      res.json(book);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async updateBook(req, res) {
    try {
      const updatedBook = await booksService.updateBook(req.params.id, req.body);
      res.json(updatedBook);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async deleteBook(req, res) {
    try {
      await booksService.deleteBook(req.params.id);
      res.json({ message: "Book deleted successfully" });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}

export default new BooksController();
