const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// Route POST pour ajouter une recette
router.post('/', async (req, res) => {
    try {
        const { title, description, ingredients, steps, photo } = req.body;

        const newRecipe = new Recipe({ title, description, ingredients, steps, photo });
        await newRecipe.save();

        res.status(201).json(newRecipe);
    } catch (err) {
        console.error('Erreur lors de la création de la recette :', err.message);
        res.status(400).json({ error: 'Erreur lors de la création de la recette.' });
    }
});

// Route GET pour obtenir toutes les recettes
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find(); // Récupérer toutes les recettes
        res.status(200).json(recipes);
    } catch (err) {
        console.error('Erreur lors de la récupération des recettes :', err.message);
        res.status(400).json({ error: 'Erreur lors de la récupération des recettes.' });
    }
});

module.exports = router;
