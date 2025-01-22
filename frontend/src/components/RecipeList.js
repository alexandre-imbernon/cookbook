import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            const response = await axios.get("http://localhost:3000/api/recipes");
            setRecipes(response.data);
        };

        fetchRecipes();
    }, []);

    return (
        <div>
            <ul>
                {recipes.map((recipe) => (
                    <li key={recipe._id}>
                        <Link to={`/edit/${recipe._id}`}>{recipe.title}</Link>
                    </li>
                ))}
            </ul>
            <Link to="/create">Ajouter une recette</Link>
        </div>
    );
};

export default RecipeList;
