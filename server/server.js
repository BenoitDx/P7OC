const express = require('express');
const mongoose = require('mongoose');
const app = express();
const userRouter = require('./route/user')
const cors = require('cors');
const booksRoutes = require('./route/books'); 

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

// Middlewares pour analyser le corps de la requête
app.use(express.json());
app.use(cors());

// route  pour tester la connexion à la base de données
app.get('/health', (req, res) => {
  res.send('Le serveur est en ligne et connecté à la base de données.');
});

// Gestionnaire d'événement en cas de déconnexion 
mongoose.connection.on('disconnected', () => {
  console.log('Déconnexion de la base de données.');
});

// Gestionnaire d'événement en cas d'erreur 
mongoose.connection.on('error', (error) => {
  console.error('Erreur de connexion à la base de données :', error);
});

app.use('/api/auth', userRouter);
app.use('/api/books', booksRoutes);