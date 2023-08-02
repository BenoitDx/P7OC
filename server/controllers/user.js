const User = require('../models/user');

const signUp = async (req, res) => {
    try {
      // Récupérez les informations de l'utilisateur depuis la requête 
      const { email, password } = req.body;
  
      // Vérifiez si l'utilisateur existe déjà dans la base de données
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'Cet email est déjà enregistré.' });
      }
  
      // Créez un nouvel utilisateur avec les données fournies
      const newUser = new User({ email, password });
  
      // Enregistrez le nouvel utilisateur dans la base de données
      await newUser.save();
  
      // Répondez avec succès
      res.status(201).json({ message: 'Utilisateur enregistré avec succès.' });
    } catch (error) {
      // En cas d'erreur, renvoyez une réponse d'erreur
      res.status(500).json({ message: 'Une erreur s\'est produite lors de l\'inscription de l\'utilisateur.' });
    }
  };

  module.exports = { signUp,};