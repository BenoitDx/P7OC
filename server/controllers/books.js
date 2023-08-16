// Importation du modèle 'Book'
const Book = require('../models/book');
// Importation du module 'fs' pour les opérations de système de fichiers
const fs = require('fs');

// Création d'un nouveau livre
exports.createBook = (req, res, next) => {
    // Conversion de la chaîne JSON en objet pour obtenir les détails du livre
    const bookObject = JSON.parse(req.body.book);
    // Suppression des identifiants du livre et de l'utilisateur générés par MongoDB
    delete bookObject._id;
    delete bookObject._userId;

    // Création d'une nouvelle instance de 'Book' en utilisant le modèle 'Book'
    const book = new Book({
        ...bookObject,
        // Attribution de l'ID de l'utilisateur
        userId: req.auth.userId,
        // Construction de l'URL de l'image en utilisant le protocole et l'hôte
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    // Enregistrement du nouveau livre dans la base de données
    book.save()
        .then(() => res.status(201).json({ message: 'Votre livre a bien été enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

// Mise à jour d'un livre existant
exports.updateBook = (req, res, next) => {
    // Construction de l'objet du livre à mettre à jour, incluant une éventuelle nouvelle image
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    // Suppression de l'ID utilisateur du livre à mettre à jour
    delete bookObject._userId;

    // Recherche du livre à mettre à jour en utilisant son ID
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            // Vérification si l'utilisateur a l'autorisation de modifier ce livre
            if (book.userId !== req.auth.userId) {
                res.status(401).json({ message: "Vous n'avez pas l'autorisation requise." });
            } else {
                // Mise à jour du livre avec les nouvelles informations
                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Votre livre a bien été modifié !' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));
};

// Suppression d'un livre spécifique
exports.deleteBook = (req, res, next) => {
    // Recherche du livre à supprimer en utilisant son ID
    Book.findOne({ _id: req.params.id })
        .then(book => {
            // Vérification si l'utilisateur a l'autorisation de supprimer ce livre
            if (book.userId !== req.auth.userId) {
                res.status(401).json({ message: "Vous n'avez pas l'autorisation requise." });
            } else {
                // Suppression de l'image associée au livre du système de fichiers
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    // Suppression du livre de la base de données
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: "Votre livre est supprimé." }))
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => res.status(500).json({ error }));
};

// Récupération d'un livre spécifique
exports.getOneBook = (req, res, next) => {
    // Recherche du livre en utilisant son ID
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
};

// Récupération de tous les livres
exports.getAllBooks = (req, res, next) => {
    // Recherche de tous les livres dans la base de données
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};

// Route 'addRating' pour ajouter une note à un livre et calculer la moyenne
exports.addRating = (req, res, next) => {
    const { userId, rating } = req.body;

    // Recherche du livre en utilisant son ID
    Book.findById(req.params.id)
        .then(book => {
            // Vérification si l'utilisateur a déjà noté le livre
            const alreadyRated = book.ratings.find(rating => rating.userId === userId);
            if (alreadyRated) {
                return res.status(401).json({ message: "Vous avez déjà attribué une note à ce livre." });
            }

            // Ajout de la nouvelle notation à la liste des évaluations du livre
            const newRating = { userId, grade: rating };
            book.ratings.push(newRating);

            // Calcul de la nouvelle note moyenne en tenant compte de la nouvelle notation
            const allRatings = book.ratings.map(rating => rating.grade);
            const totalRatings = allRatings.reduce((sum, current) => sum + current, 0);
            const averageRating = totalRatings / book.ratings.length;
            const roundedAverageRating = Math.round(averageRating * 100) / 100; // Arrondi à deux décimales

            // Mise à jour de la note moyenne du livre dans l'objet book
            book.averageRating = roundedAverageRating;

            // Sauvegarde du livre mis à jour
            book.save()
                .then(() => {
                    // Renvoi du livre mis à jour dans la réponse
                    res.status(200).json(book);
                })
        })
        .catch(error => res.status(400).json({ error }));
};

// Route 'bestRating' pour récupérer les 3 meilleurs livres notés
exports.bestRating = (req, res, next) => {
    // Recherche de tous les livres dans la base de données, triés par note moyenne décroissante
    Book.find()
        .sort({ averageRating: -1 })
        .limit(3) // Limiter aux 3 meilleurs
        .then(bestRatedBooks => res.status(200).json(bestRatedBooks))
        .catch(error => res.status(400).json({ error }));
};
