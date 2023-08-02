const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Fonction pour l'inscription d'un utilisateur
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

        // Succès
        res.status(201).json({ message: 'Utilisateur enregistré avec succès.' });
    } catch (error) {
        // En cas d'erreur renvoyez une réponse 
        res.status(500).json({ message: 'Une erreur s\'est produite lors de l\'inscription de l\'utilisateur.' });
    }
};

// Fonction pour la connexion d'un utilisateur
const signIn = async (req, res) => {
    try {
        // Récupérez les informations de l'utilisateur depuis la requête
        const { email, password } = req.body;

        // Vérifiez si l'utilisateur existe dans la base de données
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: 'Cet email n\'est pas enregistré.' });
        }

        // Vérifiez le mot de passe 
        if (existingUser.password !== password) {
            return res.status(401).json({ message: 'Mot de passe incorrect.' });
        }

        // Encodage de l'identifiant de l'utilisateur dans le token
        const token = jwt.sign(
            { userId: existingUser._id },
            'RANDOM_TOKEN_SECRET',
            { expiresIn: '24h' }
        );

        // Succès et renvoyez le token d'authentification
        res.status(200).json({ message: 'Connexion réussie.', token });
    } catch (error) {
        // En cas d'erreur renvoyez une réponse 
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la connexion de l\'utilisateur.' });
    }
};

module.exports = { signUp, signIn };
