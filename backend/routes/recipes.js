const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const authMiddleware = require('../routes/auth').authMiddleware;



router.use(cors({
  origin: '*', // Permet toutes les origines
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization'
}));

  
// Configuration de multer pour le téléchargement d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Spécifiez le dossier où les fichiers seront enregistrés
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Donne un nom unique aux fichiers
  }
});

const upload = multer({ storage: storage });

// Route POST pour ajouter une recette (avec une image)
router.post('/', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    const { title, description, ingredients, steps } = req.body;
    const photo = req.file ? req.file.filename : ''; // Si une image est téléchargée, récupère son nom

    // Créer une nouvelle recette avec les données du formulaire
    const newRecipe = new Recipe({ title, description, ingredients, steps, photo });
    await newRecipe.save();

    res.status(201).json(newRecipe); // Retourne la recette nouvellement créée
  } catch (err) {
    console.error('Erreur lors de la création de la recette :', err.message);
    res.status(400).json({ error: 'Erreur lors de la création de la recette.' });
  }
});


// Route GET pour obtenir toutes les recettes ou filtrer par ingrédients
router.get('/',  async (req, res) => {
  try {
      const { ingredients } = req.query;

      let query = {}; // Base de la requête

      if (ingredients) {
          const ingredientsArray = ingredients.split(',').map(ing => ing.trim()); // Convertit en tableau
          query.ingredients = { $all: ingredientsArray }; // Recherche toutes les valeurs
      }

      const recipes = await Recipe.find(query); // Exécute la requête
      res.status(200).json(recipes);
  } catch (err) {
      console.error('Erreur lors de la récupération des recettes :', err.message);
      res.status(400).json({ error: 'Erreur lors de la récupération des recettes.' });
  }
});


// Route GET pour récupérer une requête spécifique
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    console.log("Requête pour ID :", id);

    try {
        const recipe = await Recipe.findById(id);

        if (!recipe) {
            return res.status(404).json({ error: "Recette non trouvée." });
        }

        res.status(200).json(recipe);
    } catch (err) {
        console.error("Erreur lors de la récupération de la recette :", err.message);
        res.status(400).json({ error: "Erreur lors de la récupération de la recette." });
    }
});

// Route PUT pour mettre à jour une recette
router.put('/:id',  authMiddleware, async (req, res) => {
    const { id } = req.params; // ID de la recette à mettre à jour
    const { title, description, ingredients, steps } = req.body; // Données envoyées depuis le formulaire
  
    try {
      const updatedRecipe = await Recipe.findByIdAndUpdate(
        id,
        { title, description, ingredients, steps },
        { new: true }
      );
  
      if (!updatedRecipe) {
        return res.status(404).json({ error: 'Recette non trouvée.' });
      }
  
      res.status(200).json(updatedRecipe);
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la recette :', err.message);
      res.status(400).json({ error: 'Erreur lors de la mise à jour de la recette.' });
    }
  });
  

// Route DELETE pour mettre à jour une recette
router.delete('/:id',  authMiddleware, async (req, res) => {
    let { id } = req.params;
    id = id.trim(); // Supprime les espaces ou caractères indésirables

    try {
        const deletedRecipe = await Recipe.findByIdAndDelete(id);

        if (!deletedRecipe) {
            return res.status(404).json({ error: "Recette non trouvée." });
        }

        res.status(200).json({ message: "Recette supprimée avec succès !" });
    } catch (err) {
        console.error("Erreur lors de la suppression de la recette :", err.message);
        res.status(500).json({ error: "Erreur lors de la suppression de la recette." });
    }
});

module.exports = router;