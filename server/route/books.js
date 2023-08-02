const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books');

router.get('/', booksController.getAllBooks);
router.get('/:id', booksController.getOneBook);

module.exports = router;