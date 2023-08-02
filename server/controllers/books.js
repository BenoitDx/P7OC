const Book = require('../models/book');

// Fonction pour récupérer tous les livres
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Fonction pour récupérer un livre par son ID
exports.getOneBook = async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }
      res.json(book);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
