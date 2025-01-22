const express = require('express');
const cors = require('cors'); // Importer le middleware CORS
const recipeRouter = require('./routes/recipes'); // Assurez-vous que ce fichier existe et est correctement configuré
const app = express();

// Configurer CORS
app.use(cors({
  origin: 'http://localhost:5175', // URL de votre front-end
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes autorisées
  allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
}));

// Middleware pour parser les requêtes en JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/recipes', recipeRouter);

// Middleware pour capturer toutes les autres routes (en cas de mauvaise URL)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route introuvable' });
});

// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});
