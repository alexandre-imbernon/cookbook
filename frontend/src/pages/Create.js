import React, { useState } from "react";
import axios from "axios";

const Create = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        ingredients: "",
        steps: "",
        photo: null,
    });

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
        await axios.post("http://localhost:3000/api/recipes", data);
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
