const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books');

router.get('/', booksController.getAllBooks);
router.get('/:id', booksController.getOneBook);
router.get('/bestrating', booksController.getBestBooks)
router.post('/:id/rating', booksController.rateBook)

module.exports = router;