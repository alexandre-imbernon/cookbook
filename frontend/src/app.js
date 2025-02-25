// Fonction pour récupérer et afficher toutes les recettes
async function fetchRecipes() {
  try {
    console.log("Chargement des recettes..."); // Vérification console
    const response = await fetch('http://localhost:3000/api/recipes');
    const recipes = await response.json();
    
    console.log("Recettes reçues :", recipes); // Afficher les recettes reçues

    const recipesContainer = document.getElementById('recipes');
    recipesContainer.innerHTML = ''; 

    recipes.forEach((recipe) => {
      const recipeElement = document.createElement('div');
      recipeElement.className = 'recipe';

      recipeElement.innerHTML = `
        <h2>${recipe.title}</h2>
        <p>${recipe.description}</p>
        <p><strong>Ingrédients :</strong> ${recipe.ingredients.join(', ')}</p>
        <p><strong>Étapes :</strong> ${recipe.steps.join(', ')}</p>
        <img src="http://localhost:3000/uploads/${recipe.photo}" alt="${recipe.title}" />
        <button class="edit-btn" data-id="${recipe._id}">Modifier</button>
        <button class="delete-btn" data-id="${recipe._id}">Supprimer</button>
      `;

      recipesContainer.appendChild(recipeElement);
    });

    // Ajouter événements aux boutons de suppression
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', async (e) => {
        const recipeId = e.target.getAttribute('data-id');
        await deleteRecipe(recipeId);
      });
    });

    // Ajouter événements aux boutons de modification
    document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', async (e) => {
        const recipeId = e.target.getAttribute('data-id');
        openEditForm(recipeId);
      });
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des recettes :', error);
  }
}

// Ouvrir le formulaire de modification avec les infos de la recette
async function openEditForm(recipeId) {
  try {
    const response = await fetch(`http://localhost:3000/api/recipes/${recipeId}`);
    const recipe = await response.json();

    document.getElementById('editRecipeId').value = recipe._id;
    document.getElementById('editTitle').value = recipe.title;
    document.getElementById('editDescription').value = recipe.description;
    document.getElementById('editIngredients').value = recipe.ingredients.join(', ');
    document.getElementById('editSteps').value = recipe.steps.join(', ');

    document.getElementById('editFormContainer').style.display = 'block';
  } catch (error) {
    console.error('Erreur lors du chargement de la recette à modifier :', error);
  }
}

// Modifier une recette
document.getElementById('editRecipeForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const recipeId = document.getElementById('editRecipeId').value;
  const title = document.getElementById('editTitle').value;
  const description = document.getElementById('editDescription').value;
  const ingredients = document.getElementById('editIngredients').value.split(',').map(ing => ing.trim());
  const steps = document.getElementById('editSteps').value.split(',').map(step => step.trim());

  try {
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
  } catch (error) {
    console.error("Erreur lors de la modification :", error);
  }
});

// Supprimer une recette
async function deleteRecipe(recipeId) {
  if (!confirm("Voulez-vous vraiment supprimer cette recette ?")) return;

  try {
    const response = await fetch(`http://localhost:3000/api/recipes/${recipeId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert("Recette supprimée !");
      fetchRecipes();
    } else {
      const error = await response.json();
      alert(`Erreur : ${error.error}`);
    }
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
  }
}

// Ajouter une nouvelle recette
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
      form.reset();
      fetchRecipes();
    } else {
      const error = await response.json();
      alert(`Erreur : ${error.error}`);
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la recette :', error);
  }
});

// Charger les recettes au démarrage
window.onload = fetchRecipes;
