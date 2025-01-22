// Fonction pour récupérer et afficher toutes les recettes
async function fetchRecipes() {
  try {
    const response = await fetch('http://localhost:3000/api/recipes'); // Appeler l'API back-end
    const recipes = await response.json();

    const recipesContainer = document.getElementById('recipes');
    recipesContainer.innerHTML = ''; // Nettoyer le conteneur avant d'ajouter les recettes

    recipes.forEach((recipe) => {
      const recipeElement = document.createElement('div');
      recipeElement.className = 'recipe';

      recipeElement.innerHTML = `
        <h2>${recipe.title}</h2>
        <p>${recipe.description}</p>
        <p><strong>Ingrédients :</strong> ${recipe.ingredients.join(', ')}</p>
        <p><strong>Étapes :</strong> ${recipe.steps.join(', ')}</p>
        <img src="http://localhost:3000/uploads/${recipe.photo}" alt="${recipe.title}" />
      `;

      recipesContainer.appendChild(recipeElement);
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des recettes :', error);
  }
}

// Ajouter une nouvelle recette via le formulaire
document.getElementById('recipeForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  try {
    const response = await fetch('http://localhost:3000/api/recipes', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      alert('Recette ajoutée avec succès !');
      form.reset(); // Réinitialiser le formulaire après la soumission
      fetchRecipes(); // Recharger les recettes
    } else {
      const error = await response.json();
      alert(`Erreur : ${error.error}`);
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la recette :', error);
  }
});

// Charger les recettes dès que la page se charge
window.onload = fetchRecipes;
