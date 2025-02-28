let allRecipes = []; // Stocke toutes les recettes

// Fonction pour récupérer toutes les recettes et les afficher
async function fetchRecipes() {
  try {
    console.log("Chargement des recettes...");
    const response = await fetch('http://localhost:3000/api/recipes');
    allRecipes = await response.json(); // Stocker les recettes en mémoire
    console.log("Recettes reçues :", allRecipes);
    displayRecipes(allRecipes);
  } catch (error) {
    console.error('Erreur lors de la récupération des recettes :', error);
  }
}

// Afficher les recettes dans le DOM
function displayRecipes(recipes) {
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

  // Attache les événements aux boutons après l'affichage
  addEventListeners();
}

// Filtrer les recettes en temps réel
document.getElementById('searchIngredients').addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredRecipes = allRecipes.filter(recipe => 
    recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm))
  );
  displayRecipes(filteredRecipes);
});

// Ajouter les événements sur les boutons Modifier et Supprimer
function addEventListeners() {
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', async (e) => {
      const recipeId = e.target.getAttribute('data-id');
      await deleteRecipe(recipeId);
    });
  });

  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', async (e) => {
      const recipeId = e.target.getAttribute('data-id');
      openEditForm(recipeId);
    });
  });
}

// Ouvrir le formulaire de modification
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
      fetchRecipes();
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
