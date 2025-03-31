const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Clé secrète pour JWT
const JWT_SECRET = 'ton_secret'; // Remplace par une variable d'environnement en prod

// Route d'inscription
router.post('/register', async (req, res) => {
  console.log("Requête reçue :", req.body); // Ajoute cette ligne
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Utilisateur déjà existant' });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Route de connexion
router.post('/login', async (req, res) => {
    console.log("Connexion requise avec", req.body); // Vérifie si le corps de la requête est bien passé
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            console.log("Utilisateur non trouvé");
            return res.status(400).json({ error: 'Utilisateur non trouvé' });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Mot de passe incorrect");
            return res.status(400).json({ error: 'Mot de passe incorrect' });
        }

        // Générer un token JWT
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        console.log("Token généré", token);
        res.json({ token });
    } catch (err) {
        console.error("Erreur serveur", err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});


// Middleware pour vérifier le token
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'Vous devez être connecté pour effectuer cette action.' });
    }
    try {
        const verified = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token invalide, veuillez vous reconnecter.' });
    }
};


module.exports = router; 
module.exports.authMiddleware = authMiddleware;
