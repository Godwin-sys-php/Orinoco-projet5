document.getElementById('theme').addEventListener('change', (event) => {
    if (event.target.value == "teddies" || event.target.value == "cameras" || event.target.value == "furniture") {
        getAllProduct(event.target.value);
    } else if (event.target.value == "rien") {
        document.getElementById('productDiv').innerHTML= '<div class="col text-center font-italic">Choissisez un thème</div>';
    } else {
        document.getElementById('productDiv').innerHTML= '<div class="alert alert-danger" role="alert">Une erreur a eu lieu</div>';
    }
});