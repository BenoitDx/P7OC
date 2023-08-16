const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./route/user')
const booksRoutes = require('./route/books'); 
const path = require('path');

// Configuration de la connexion à MongoDB
const mongoDBURL = 'mongodb://root:example@mongo:27017/';
mongoose.connect(mongoDBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connexion à MongoDB réussie !');

    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      console.log(`Le serveur écoute sur le port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Connexion à MongoDB échouée :', error);
  });

  const app = express();
  app.use(express.json());
  
  app.use((req, res, next) => {
    // permet d'accéder à notre API depuis n'importe quelle origine ('*')
    res.setHeader('Access-Control-Allow-Origin', '*');
    // permet d'ajouter les headers mentionnés aux requêtes envoyées vers notre API ('Origin, X-Requested-With ...')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // permet d'envoyer des requêtes avec les différentes méthodes metntionnées ('GET, POST, PUT, DELETE ...')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
  });
  
  // enregistrement du système de routes 
  app.use('/api/books', booksRoutes);
  // enregistrement du système de routes 
  app.use('/api/auth', userRouter);
  app.use('/images', express.static(path.join(__dirname, 'images')));
  
  module.exports = app;