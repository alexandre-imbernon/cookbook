import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Create = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        ingredients: "",
        steps: "",
        photo: null,
    });

    const navigate = useNavigate(); // Pour rediriger l'utilisateur
    console.log("Connexion réussie, redirection...");
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, photo: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        try {
            const token = localStorage.getItem("token"); // Récupération du token de l'utilisateur
            const config = {
                headers: { Authorization: `Bearer ${token}` }, // Ajout du token dans la requête
            };

            await axios.post("http://localhost:3000/api/recipes", data, config);
            navigate("/"); // Redirection vers la page d'accueil après création
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert("Pour modifier ou ajouter des recettes, vous devez être identifié !");
                navigate("/login"); // Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
            } else {
                console.error("Erreur lors de l'ajout de la recette :", error);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="title" onChange={handleChange} placeholder="Titre" />
            <textarea name="description" onChange={handleChange} placeholder="Description" />
            <input type="text" name="ingredients" onChange={handleChange} placeholder="Ingrédients (séparés par des virgules)" />
            <input type="text" name="steps" onChange={handleChange} placeholder="Étapes (séparées par des virgules)" />
            <input type="file" name="photo" onChange={handleFileChange} />
            <button type="submit">Créer</button>
        </form>
    );
};

export default Create;
