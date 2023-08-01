/* Dans ce bloc de code se trouve la racine de l'application.
On trouve également la configuration d'express js et la connexion
à la base de données MongoDB */

// Importation des modules nécessaires
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

// connexion à MongoDB
mongoose
  .connect('mongodb://root:example@mongo:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Gestion des requêtes cross-origin (CORS)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});



app.use((req, res) => {
  console.log('Réponse envoyée avec succès');
});

module.exports = app; // Exporter l'application pour une utilisation externe