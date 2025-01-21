const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const recipeRoutes = require('./routes/recipes'); // Importation des routes

const app = express();

// Middleware
app.use(bodyParser.json());

// Utilisation des routes
app.use('/api/recipes', recipeRoutes); // Préfixe pour les routes de recettes

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/cookbook', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((err) => console.error('Erreur de connexion à MongoDB :', err));

// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
