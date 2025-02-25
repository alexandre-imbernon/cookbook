// Fonction pour récupérer et afficher toutes les recettes
async function fetchRecipes() {
  try {
    const response = await fetch('http://localhost:3000/api/recipes'); // Appel API
    const recipes = await response.json();

    const recipesContainer = document.getElementById('recipes');
    recipesContainer.innerHTML = ''; // Nettoyer avant d'afficher

    recipes.forEach((recipe) => {
      const recipeElement = document.createElement('div');
      recipeElement.className = 'recipe';

      recipeElement.innerHTML = `
        <h2>${recipe.title}</h2>
        <p>${recipe.description}</p>
        <p><strong>Ingrédients :</strong> ${recipe.ingredients.join(', ')}</p>
        <p><strong>Étapes :</strong> ${recipe.steps.join(', ')}</p>
        <img src="http://localhost:3000/uploads/${recipe.photo}" alt="${recipe.title}" />
        <button class="delete-btn" data-id="${recipe._id}">Supprimer</button>
      `;

      recipesContainer.appendChild(recipeElement);
    });

    // Ajouter un événement à chaque bouton de suppression
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', async (e) => {
        const recipeId = e.target.getAttribute('data-id');
        await deleteRecipe(recipeId);
      });
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des recettes :', error);
  }
}

async function deleteRecipe(recipeId) {
  if (!confirm("Voulez-vous vraiment supprimer cette recette ?")) return; // Demande confirmation

  try {
    const response = await fetch(`http://localhost:3000/api/recipes/${recipeId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert("Recette supprimée !");
      fetchRecipes(); // Recharger la liste après suppression
    } else {
      const error = await response.json();
      alert(`Erreur : ${error.error}`);
    }
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
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

async function openEditForm(recipeId) {
  const response = await fetch(`http://localhost:3000/api/recipes/${recipeId}`);
  const recipe = await response.json();

  document.getElementById('editRecipeId').value = recipe._id;
  document.getElementById('editTitle').value = recipe.title;
  document.getElementById('editDescription').value = recipe.description;
  document.getElementById('editIngredients').value = recipe.ingredients.join(', ');
  document.getElementById('editSteps').value = recipe.steps.join(', ');

  document.getElementById('editFormContainer').style.display = 'block';
}
document.getElementById('editRecipeForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const recipeId = document.getElementById('editRecipeId').value;
  const title = document.getElementById('editTitle').value;
  const description = document.getElementById('editDescription').value;
  const ingredients = document.getElementById('editIngredients').value.split(',').map(ing => ing.trim());
  const steps = document.getElementById('editSteps').value.split(',').map(step => step.trim());

  const response = await fetch(`http://localhost:3000/api/recipes/${recipeId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description, ingredients, steps }),
  });

  if (response.ok) {
    alert('Recette mise à jour avec succès !');
    document.getElementById('editFormContainer').style.display = 'none';
    fetchRecipes(); // Recharger la liste des recettes
  } else {
    const error = await response.json();
    alert(`Erreur : ${error.error}`);
  }
});