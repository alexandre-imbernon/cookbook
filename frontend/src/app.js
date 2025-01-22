document.getElementById('recipeForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Récupérer les données du formulaire
  const form = e.target;
  const formData = new FormData(form);

  // Afficher les données dans la console pour vérifier leur présence
  for (let [key, value] of formData.entries()) {
    console.log(key + ": " + value);
  }

  // Envoyer la requête POST avec les données du formulaire
  const response = await fetch('http://localhost:3000/api/recipes', {
    method: 'POST',
    body: formData,
  });

  if (response.ok) {
    alert('Recette ajoutée avec succès !');
    form.reset();  // Réinitialiser le formulaire après la soumission
    fetchRecipes();  // Recharger les recettes
  } else {
    const error = await response.json();
    alert(`Erreur : ${error.error}`);
  }
});
