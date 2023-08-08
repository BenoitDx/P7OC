/*Ce bloc de code comprend les fonctions qui 
permettront à l'usager de s'inscrire et se connecter.
*/

// Importation du module bcrypt pour le chiffrement des mots de passe
const bcrypt = require('bcryptjs');

const User = require('../models/User');

// Importation du module jsonwebtoken pour la gestion des tokens JWT
const jwt = require('jsonwebtoken');

// Fonction pour l'inscription d'un utilisateur
exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10) // Chiffrement du mot de passe fourni par l'utilisateur
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash // Utilisation du mot de passe chiffré
            });
            user.save()
            .then(() => res.status(201).json({ message: 'utilisateur créé' }))
            .catch(error => {
                console.error(error);
                res.status(400).json({ error });
            });
        })
        .catch(error => res.status(500).json({ error }));
};

// Fonction pour la connexion d'un utilisateur
exports.login = (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => { // Vérification si l'utilisateur existe
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            bcrypt.compare(req.body.password, user.password) // Comparaison du mot de passe fourni avec le mot de passe stocké
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id }, // Encodage de l'identifiant de l'utilisateur dans le token
                            'RANDOM_TOKEN_SECRET', // Clé secrète utilisée pour la création du token
                            { expiresIn: '24h' } // Durée de validité du token
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };