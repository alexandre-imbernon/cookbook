const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const recipeRoutes = require('./routes/recipes'); // Importation des routes
const app = express();
const authRoutes = require('./routes/auth');

// Ajout de bodyParser avant les routes
app.use(bodyParser.json()); // Permet de traiter le corps des requêtes en JSON

// Routes
app.use('/auth', authRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/recipes', recipeRoutes); // Préfixe pour les routes de recettes

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
