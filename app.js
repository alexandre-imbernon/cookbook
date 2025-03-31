const express = require('express');
const cors = require('cors'); 
const recipeRouter = require('./routes/recipes'); 
const authRouter = require('./routes/auth'); 

const app = express();

// Configurer CORS pour autoriser le front-end à communiquer avec le backend
app.use(cors({
  origin: 'http://localhost:5175', // L'URL de ton front-end
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware pour parser les requêtes en JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes d'authentification (connexion, inscription)
app.use('/api/auth', authRouter);

// Routes des recettes
app.use('/api/recipes', recipeRouter);

// Middleware pour gérer les erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route introuvable' });
});

// Lancer le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur backend démarré sur http://localhost:${PORT}`);
});
