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
      recipeElement.className = ' col-md-6 mb-4';
  
      recipeElement.innerHTML = `
          <div class="col-md-4">
              <div class="card h-100 shadow-sm">
                  <img src="http://localhost:3000/uploads/${recipe.photo}" alt="${recipe.title}" />
                  <div class="card-body">
                      <h5 class="card-title">${recipe.title}</h5>
                      <p class="card-text">${recipe.description}</p>
                      <p><strong>Ingrédients :</strong> ${recipe.ingredients.join(', ')}</p>
                      <p><strong>Étapes :</strong> ${recipe.steps.join(', ')}</p>
                      <button class="btn btn-success edit-btn" data-id="${recipe._id}"><i class="fas fa-edit"></i> Modifier</button>                    
                    <button class="btn btn-danger delete-btn" data-id="${recipe._id}"><i class="fas fa-trash-alt"></i> Supprimer</button>                 
                      <button class="btn btn-danger favorite-btn" data-id="${recipe._id}" data-title="${recipe.title}" data-photo="${recipe.photo}">Ajouter aux favoris</button>
                  </div>
              </div>
          </div>
      `;
  
      // Ajouter la recette à la liste des recettes affichées
      recipesContainer.appendChild(recipeElement);
  
      // Ajouter un écouteur d'événements pour le bouton "Ajouter aux favoris"
      const favoriteBtn = recipeElement.querySelector('.favorite-btn');
      favoriteBtn.addEventListener('click', function() {
          ajouterFavoris(recipe._id, recipe.title, recipe.photo);
      });
  });
  
  // Fonction pour ajouter une recette aux favoris
  function ajouterFavoris(id, title, photo) {
      let favoris = JSON.parse(localStorage.getItem('favoris')) || [];
      
      // Vérifier si la recette est déjà dans les favoris
      if (!favoris.some(fav => fav.id === id)) {
          favoris.push({ id, title, photo });
          localStorage.setItem('favoris', JSON.stringify(favoris));
          alert(`${title} a été ajouté aux favoris !`);
      } else {
          alert(`${title} est déjà dans vos favoris.`);
      }
  }
  

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
