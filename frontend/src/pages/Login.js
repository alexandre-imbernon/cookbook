import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import correct

const Login = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const navigate = useNavigate(); // Hook pour la redirection

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/api/auth/login", formData);
            localStorage.setItem("token", response.data.token);
            
            console.log("Connexion réussie, redirection...");
            navigate("/"); // Redirige vers la page d'accueil après connexion
        } catch (error) {
            console.error("Erreur de connexion:", error.response?.data?.error || error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="Nom d’utilisateur" onChange={handleChange} />
            <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} />
            <button type="submit">Se connecter</button>
        </form>
    );
};

export default Login;
