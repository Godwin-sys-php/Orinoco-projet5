var perso, customTxt;// On crée les variables 
let objProduct = new Product($_GET('type'), 'http://localhost:3000/api/');// Une nouvelle instance de l'objet
//On mets des spinners dans les zones d'affichage
imageDiv.innerHTML = '<div class="col text-center"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div>';
nameOfProduct.innerHTML = '<div class="col text-center"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div>';
description.innerHTML = '<div class="col text-center"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div>';
price.innerHTML = '<div class="col text-center"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div>';
addToCart.disabled= true;// Et on désactive le bouton
objProduct.getProductWithId($_GET('id'))// On récupère les informations d'un produit via l'URL
    .then(data => {
        //Lorsqu'on a les informations de l'API, tout revient à la normal et on attribue des valeurs aux éléments 
        addToCart.disabled= false;
        imageDiv.innerHTML = '<img class="image" alt="Site logo">';
        document.getElementsByClassName('image')[0].src = data.imageUrl;
        nameOfProduct.textContent = data.name;
        description.textContent = data.description;
        price.innerHTML = toEuro(data.price) + "€";
        switch ($_GET('type')) {
            case "teddies":
                perso = data.colors;// Les possibilités de personnalisation
                customTxt = "Couleur:";// Le texte qu'il y aura dans la localStorage
                persoTxt.textContent = "Couleur:";// Le texte qu'il y aura dans le `label`
                break;
            case "cameras":
                perso = data.lenses;
                customTxt = "Lentilles:";
                persoTxt.textContent = "Lentilles:";
                break;
            case "furniture":
                perso = data.varnish;
                customTxt = "Couleur du vernis:";
                persoTxt.textContent = "Couleur du vernis:";
                break;
        }
        for (let i in perso) {
            custom.innerHTML += `<option value="${perso[i]}">${perso[i]}</option>`;// On insère les options de personnalisation dans des `option`
        }
    }).catch(() => { window.location.href = "index.html"; });// En cas d'erreur (surement un faux paramètre URL) en redirige faire l'accueil

addToCart.addEventListener('click', () => { // Lorsque l'on clique sur le bouton pour ajouter au panier:  
    if (isInt(quantity.value)) { // Si la quantité est un entier supérieur à 0
        if (perso.includes(custom.value)) { // Si le tableau des préférence possible contient bien la préférence de l'utilisateur: 
            let localStorageArray= getCartIndex();// On récupère les index des localStorage
            let a;// La variable qui va définir l'index de la localStorage ex: `item${a}` => item1
            if (localStorageArray.length == 0) {// Si il n'y a rien dans le panier:
                a= 1;// a prends 1 pour item1
            } else {// Sinon
                localStorageArray= sort(localStorageArray); // On classe les éléments du tableau
                let until= getLastElement(localStorageArray);// On récupère le dernier élément
                a= parseInt(until.split('m')[1])+1;// On initialise l'index du prochain
            }
            objProduct.getProductWithId($_GET('id')) //On récupère ses informations en fonction de l'id situé dans les paramètres
                .then(data => {
                    let item = {// On crée l'objet que l'on va insérer dans une localStorage
                        key: `item${a}`,// La clé
                        id: $_GET('id'),// L'id
                        type: $_GET('type'),// Le type (teddies, caméras, furnitures)
                        quantity: quantity.value,// La quantité
                        total: data.price * quantity.value// Le total
                    }

                    let allItem = getCart();// On récupère le panier
                    let index = 0;// On initialise le compteur à 0
                    let newAllItem;
                    while (index < allItem.length) {// Tant que l'on est pas arriver à la taille du panier (c'est une boucle for mais avec un while) en bref on va parcourir le panier
                        newAllItem = JSON.parse(allItem[index]);// On parse le JSON stringifier
                        if (newAllItem.id == item.id) {// Si la localStorage a le même id que celle que l'on veut créer:
                            var verif = false;// La variable de vérification vaut false
                            var capture = newAllItem.key;// On capture l'élément
                            index = allItem.length;// Et on arrete la boucle
                        } else {// Sinon
                            var verif = true;// La variable de vérification vaut true
                            index++;// Et on incrément index, pour ne pas avoir une boucle infini
                        }
                    }

                    if (verif == false) { // Si verif = false
                        let newItem = localStorage.getItem(capture);// On récupère l'élément capturer
                        newItem = JSON.parse(newItem);// On parse le JSON
                        newItem.quantity = parseInt(newItem.quantity, 10) + parseInt(quantity.value, 10);// ...la quantité...
                        newItem.total = newItem.quantity * data.price;// ...et le total...

                        localStorage.removeItem(capture);// On supprime l'ancien élément...
                        localStorage.setItem(capture, JSON.stringify(newItem));// ... pour en mettre un autre presque pareil
                        /* 
                            Le code plus haut permet de gérer les ajouts du même produits plusieurs fois.
                            Exemple: Le client prend 5 Norbert la première fois. Et la seconde fois il en prends encore 3. Au lieu d'ajouter 2 fois Norbert aau panier, on va juste modifier l'ancien, et on aura juste un seul Norbert de 8 pièces 
                        */
                    } else {
                        localStorage.setItem(`item${a}`, JSON.stringify(item));// Sinon on va juste insérer l'élément
                    }
                }).catch(() => { alert('Une erreur a eu lieu') });//On cas d'erreur on fait juste une simple alerte
                $('#success').modal('show');// On affiche l'alert de succés
        } else { // Sinon si le tableau des préférence possible ne contient pas la préférence de l'utilisateur (surement une modification du code source): 
            $('#error-select').modal('show');// On affiche une alerte d'erreur
        }
    } else {// Si la quantité n'est pas un nombre entier supérieur à 0:
        $('#error').modal('show');// On affiche une autre alert d'erreur
    }

});