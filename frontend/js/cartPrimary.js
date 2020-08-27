window.onload= async () => { //La fonction est asynchrone pour permettre l'ajout d'un spinner
    var cart = getCart();// On mets les localStorages dans un tableau
    
    //Initialisation des variables qui vont être utiliser dans la boucle
    var json;
    let objProdut;

    if (cart.length == 0){ // Si le panier est vide, on affiche un message
        productDiv.className="text-center";
        productDiv.innerHTML="<h6 class='text-center'>Votre panier est malheuresement vide!</h6>";
    } else { //Sinon...
        for (let i in cart) { //On parcourt le tableau pour insérer des card une par un via l'id
            json = JSON.parse(cart[i]);// On parse le JSON stringifier 
            objProdut = new Product(json.type, 'http://localhost:3000/api/');//On crée une nouvelle instance de l'objet qui va nous permettre les appels API

            //On crée les éléments, on les insère et on les donne des attributs
            let divCol = document.createElement('div');
            let divCard = document.createElement('div');
            let divCardBody = document.createElement('div');
            let img = document.createElement('img');
            let h5 = document.createElement('h5');
            let p = document.createElement('p');

            divCol.className = "col-12 col-lg-4";
            divCard.className = "card";
            divCardBody.className = "card-body";

            divCardBody.innerHTML = '<div class="col text-center"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div>';
            
            productDiv.appendChild(divCol);
            divCol.appendChild(divCard);
            divCard.appendChild(divCardBody);

            await objProdut.getProductWithId(json.id)//On attend la fin du fetch
                .then(data => {
                    //On assigne toute les valeurs en fonctions de la réponse
                    img.src = data.imageUrl;
                    h5.textContent = data.name;
                    img.width = 150;
                    p.innerHTML = `${data.description}<br /><small class="text-muted" id="total${json.key}">Total: ${toEuro(json.total)}€</small><br /><small class="text-muted">Prix: ${toEuro(data.price)}€</small><br /><small class="text-muted" id="quantity_${json.key}">Pièces: ${json.quantity}</small><br /><button class="btn btn-danger btn-sm" onclick="decrease(\'${json.key}\', ${data.price});"> - </button> <button class="btn btn-primary btn-sm" onclick="increase(\'${json.key}\', ${data.price});"> + </button><br /><br /><button class="btn btn-danger btn-block" onclick="localStorage.removeItem(\'${json.key}\');window.location.reload();">Retirer</button>`;
                }).catch(error => { productDiv.textContent = "Une erreur a eu lieu"; });

            h5.className = "card-title";

            p.className = "card-text";

            divCardBody.innerHTML = '';//On retire le spinner

            divCardBody.appendChild(img);
            divCardBody.appendChild(h5);
            divCardBody.appendChild(p);
            if (i == cart.length - 1) { //Et lorsqu'on arrive à la fin, on affiche le total
                totalDiv.innerHTML = `<br /><h3 class="text-center" id="totalH3">Total: ${toEuro(getTotalOfCart())}€</h3><br /><button class="btn btn-warning btn-block btn-lg" onclick="clean();">Vider le panier</button><button class="btn btn-success btn-block btn-lg" onclick="document.getElementsByClassName(\'d-none\')[0].className=\'visible\';this.className=\'d-none\';">Passer la commande</button>`;
            }
        }
    }
};