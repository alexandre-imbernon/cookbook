const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Obligatoire
    description: { type: String, required: true }, // Obligatoire
    ingredients: { type: [String], required: true }, // Liste obligatoire
    steps: { type: [String], required: true }, // Liste obligatoire
    photo: { type: String, default: 'placeholder.jpg' }, // Facultatif
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Recipe', recipeSchema);
