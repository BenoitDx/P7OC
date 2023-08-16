// importation de sharp
const sharp = require('sharp');
// importation du système des chemins des fichiers
const path = require('path');
const fs = require('fs');
            
// fonction pour optimiser les images
const optimizeImage = (req, res, next) => {

    // vérification s'il y a une image ou non
    if (!req.file) return next();

    //  Si une image est présente, enregistrer le chemin de l'image originale
    const imageInput = req.file.path;
    // Préparer le chemin pour la sortie de l'image optimisée
    const imageOutput = req.file.path.replace(/\.(jpg|jpeg|png)$/, ".webp");
    // Utiliser 'sharp' pour effectuer les transformations sur l'image
    sharp(imageInput)
    // Redimensionner l'image téléchargée par les utilisateurs
    .resize({ width: 200 })
    // Changer le format de l'image en format WebP
    .toFormat('webp')
    // Enregistrer l'image optimisée au chemin de sortie
    .toFile(imageOutput)
    // s'il n'y a eu aucunes erreurs passer au 'then'
    .then(() => {
      // Supprime l'ancienne image non optimisée
      fs.unlinkSync(imageInput);
      // mise à jour du fichier pour récupérer l'image optimisée et son changement de format
      req.file.path = imageOutput;
      req.file.mimetype = 'image/webp';
      req.file.filename = req.file.filename.replace(/\.(jpg|jpeg|png)$/, '.webp');
      // passage au prochain middleware
      next();
    })
    // permet de gérer s'il y a une erreur
    .catch((error) => {
      console.error("Erreur lors de la modification de l'image :", error);
      next();
    });
};

module.exports = optimizeImage;