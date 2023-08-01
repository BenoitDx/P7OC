const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Configuration de la connexion à MongoDB
const mongoDBURL = 'mongodb://root:example@mongo:27017/';
mongoose.connect(mongoDBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connexion à MongoDB réussie !');
    // Vous pouvez lancer le serveur ici ou exécuter d'autres actions après la connexion réussie.
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      console.log(`Le serveur écoute sur le port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Connexion à MongoDB échouée :', error);
  });

// Exemple de route simple pour tester la connexion à la base de données
app.get('/health', (req, res) => {
  res.send('Le serveur est en ligne et connecté à la base de données.');
});

// Autres configurations et routes de votre application backend
// ...

// Gestionnaire d'événement en cas de déconnexion de la base de données
mongoose.connection.on('disconnected', () => {
  console.log('Déconnexion de la base de données.');
});

// Gestionnaire d'événement en cas d'erreur de connexion à la base de données
mongoose.connection.on('error', (error) => {
  console.error('Erreur de connexion à la base de données :', error);
});