theme.addEventListener('change', (event) => { //Lorsqu'on change la valeur du select:
    if (event.target.value == "teddies" || event.target.value == "cameras" || event.target.value == "furniture") { // Si elle est correct
        getAllProduct(event.target.value);// On récupère tout les produits du type choisit et on les affiche
    } else if (event.target.value == "rien") { // Si c'est "rien" donc il est encore sur "Aucun produit choisit"
        productDiv.innerHTML= '<div class="col text-center font-italic">Choissisez un thème</div>';// On lui demande d'en choisir un
    } else {// Sinon
        productDiv.innerHTML= '<div class="alert alert-danger" role="alert">Une erreur a eu lieu</div>';// On rend une erreur
    }
});