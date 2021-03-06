const getAllProduct = async (type) => { // Une fonction pour récuperer un tout les produits d'un type précis et les afficher (utiliser dans la section accueil et produits)
    let objProdut = new Product(type, 'http://localhost:3000/api/');
    productDiv.innerHTML = '<div class="col text-center"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div>';
    objProdut.getAllProduct()
        .then(data => {
            productDiv.innerHTML = '';
            for (let i in data) {
                let divCol = document.createElement('div');
                let divCard = document.createElement('div');
                let divCardBody = document.createElement('div');
                let img = document.createElement('img');
                let h5 = document.createElement('h5');
                let p = document.createElement('p');
                let small = document.createElement('small');
                let a = document.createElement('a');
                let br = document.createElement('br');
                let btn = document.createElement('button');

                divCol.className = "col-12 col-lg-4";
                divCard.className = "card";
                divCardBody.className = "card-body";

                img.src = data[i].imageUrl;
                img.width = 150;

                h5.className = "card-title";
                h5.innerHTML = data[i].name;

                p.className = "card-text";
                p.innerHTML = data[i].description;

                small.className = "text-muted";
                small.innerHTML = "Prix: " + toEuro(data[i].price) + "€";

                a.href = `parameter.html?id=${data[i]._id}&type=${type}`;

                btn.className = "btn btn-success";
                btn.innerHTML = '<i class="fas fa-cart-plus"></i> Ajouter au panier';

                productDiv.appendChild(divCol);
                divCol.appendChild(divCard);
                divCard.appendChild(divCardBody);

                divCardBody.appendChild(img);
                divCardBody.appendChild(h5);
                divCardBody.appendChild(p);
                divCardBody.appendChild(small);
                divCardBody.appendChild(br);
                divCardBody.appendChild(a);
                a.appendChild(btn);
            }
        }).catch((error) => { productDiv.innerHTML = '<div class="col text-center">Une erreur a eu lieu</div>'; console.log(error); });
};

const ucFirst = (str) => {
    if (str.length > 0) {
        return str[0].toUpperCase() + str.substring(1);
    } else {
        return str;
    }
};

const $_GET = (param) => { // Grace à un regex, il arrive à recupérer les paramètre URL et je l'ai appelée $_GET à la php
    let vars = {};
    window.location.href.replace(location.hash, '').replace(
        /[?&]+([^=&]+)=?([^&]*)?/gi, 
         (m, key, value) => {
            vars[key] = value !== undefined ? value : '';
        }
    );

    if (param) {
        return vars[param] ? vars[param] : null;
    }
    return vars;
};

const toEuro = (centime) => {
    return parseInt(centime) / 100;
}

const increase = (key, price) => { // Pour augmenter la quantité d'un article directement via le panier, l'élément se déclenche via un onClick directement mit dans le bouton
    let now= localStorage.getItem(key);
    nowInJson = JSON.parse(now);

    nowInJson.quantity= parseInt(nowInJson.quantity) + 1;
    nowInJson.total= parseInt(nowInJson.quantity) * price;
    
    localStorage.removeItem(key);
    localStorage.setItem(key, JSON.stringify(nowInJson));

    document.getElementById(`quantity_${key}`).textContent= `Pièces: ${nowInJson.quantity}`;
    document.getElementById(`total${key}`).textContent= `Total: ${toEuro(nowInJson.total)}€`;

    totalH3.textContent= `Total: ${toEuro(getTotalOfCart())}€`;
};

const decrease = (key, price) => { // Pour diminuer la quantité d'un article directement via le panier, l'élément se déclenche via un onClick directement mit dans le bouton
    let now= localStorage.getItem(key);
    nowInJson = JSON.parse(now);

    nowInJson.quantity= parseInt(nowInJson.quantity) - 1;
    if (nowInJson.quantity > 0) { 
        nowInJson.total= parseInt(nowInJson.quantity) * price;
        
        localStorage.removeItem(key);
        localStorage.setItem(key, JSON.stringify(nowInJson));

        document.getElementById(`quantity_${key}`).textContent= `Pièces: ${nowInJson.quantity}`;
        document.getElementById(`total${key}`).textContent= `Total: ${toEuro(nowInJson.total)}€`;

        totalH3.textContent= `Total: ${toEuro(getTotalOfCart())}€`;
    } else {
        localStorage.removeItem(key);
        window.location.reload();
    }
};

const clean = () => { // Pour vider le panier
    if (confirm('Voulez vous vraiment vider votre panier?')){
        let cart= getCart();
        for (let index in cart) {
            inJson=  JSON.parse(cart[index]);
            localStorage.removeItem(inJson.key);
        }
        window.location.reload();
    }
};

const getCart = () => { // Pour récuperer le panier en classant les localStorage
    let toReturn = [];
    for (let index = 0; index <= localStorage.length - 1; index++) {
        if (localStorage.key(index).substring(0, 4) == 'item') {
            toReturn.push(localStorage.getItem(localStorage.key(index)));
        }
    }
    return toReturn;
};

const getCartIndex = () => { // Pour récuperer les index du panier
    let toReturn = [];
    for (let index = 0; index <= localStorage.length - 1; index++) {
        if (localStorage.key(index).substring(0, 4) == 'item') {
            toReturn.push(localStorage.key(index));
        }
    }
    return toReturn;
};

const removeDuplicates = (array) => { // Pour supprimer les doublons dans un tableau
    let unique = {};
    array.forEach(function (i) {
        if (!unique[i]) {
            unique[i] = true;
        }
    });
    return Object.keys(unique);
};

const countElement = (array, element) => { // Pour compter le nombre de fois qu'un élément se répète dans un tableau
    let a= 0;
    for (let i in array){
        if (array[i] == element) {
            a++
        }
    }
    return a;
};

const removeDuplicateWithName = (array, element) => { // Pour supprimer les doublons d'un élément précis dans le tableau 
    let compteur= 0;
    let i=-1;
    while (i <= array.length-1) {
        i++;
        if (array[i] == element) {
            if (compteur == 0) {
                compteur= 4;
            } else {
                array.splice(i, 1);
                i=-1;
            }
        }
    }
};

const getTotalOfCart = () => { // Pour récuperer la valeur total du panier à l'aide d'un reducer
    let allCart = getCart();
    let total = [];
    for (let index in allCart) {
        let inJson = JSON.parse(allCart[index]);
        total.push(inJson.total);
    }
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    return total.reduce(reducer);
};

const send = async (toSend, type, status) => { // Pour envoyer au serveur le panier
    await fetch(`http://localhost:3000/api/${type}/order`, {
            method: 'post',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(toSend)
        })
        .then(await ((response) => response.json()))
        .then((data) => {
            let products= [], newProducts= [];
            for (let i in data.products){// On parcours la réponse du serveur, lus précisement les produits
                products.push(data.products[i]._id);// On mets tout les id dans un tableau
            }

            for (let index in products) {// On parcours le tableau des id
                let a= countElement(products, products[index]);// On compte le nombre de fois qu'un id se répète
                newProducts.push({ id: products[index], quantity: a });// On mets ça dans un tableau ayant un objet avec l'id et la quantité
            }

            const filteredArr = newProducts.reduce((acc, current) => { // On supprimme toutes les répétitions
              const x = acc.find((item) => item.id === current.id);
              if (!x) {
                return acc.concat([current]);
              } else {
                return acc;
              }
            }, []);

            let obj= {
                orderId: data.orderId,
                products: filteredArr
            };// On crée l'objet
            localStorage.setItem(`allProduct${ucFirst(type)}`, JSON.stringify(obj));// Pour chaque type on crée une localStorage ayant obj
            if (status) {// Si c'est le dernier élément: 
                localStorage.setItem(`contact`, JSON.stringify(data.contact));// On peut set les informations du client
                window.location= "finally.html";// Et aller vers la page de récapitulatif de la commande
            }
        });
};

const sort = (array) => { // Pour classer les élément du panier dans l'order croissant
    let nombres= [];
    for (let i in array){
      let until= array[i].split('m')[1];
      nombres.push(until);
    }
    nombres.sort((a, b) => {
      return a - b;
    });
    for (let index in nombres){
      nombres[index]= `item${nombres[index]}`;
    }
    return nombres;
};

const isInt = (value) => { // Vérifie si un nombre est bien entier et supérieur à 0
    if ((parseFloat(value) == parseInt(value)) && !isNaN(value)) {
        if (value > 0) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

const isEmpty = (value) => { // Vérifie si un champs est vide via un regex
    if (/[A-Z]|[a-z]|[0-9]/.test(value)) {
        return false;
    } else {
        return true;
    }
};

const isNotAValidEmail = (mail) => { // Vérifie si une adresse email est correct via un regex
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return false;
    }
    else {
        return true;
    }
};

const getAllType= () => { // Récupère toute les localStorage créer lors de la réponse du serveur
    let array= ['teddies', 'cameras', 'furniture'];
    let toReturn= [];
    for (let index in array) {
        if (localStorage.getItem(`allProduct${ucFirst(array[index])}`) !== null){
            toReturn.push(array[index]);
        }
    }
    return toReturn;
}

const getLastElement = (array) => { // Récupère le dernier élément d'un tableau 
    let a;
    for (let i in array){
        a= array[i];
    }
    return a;
};

const removeAllItems = () => {// Vide le panier
    let a= getCartIndex();
    for (let i in a){
        localStorage.removeItem(a[i]);
    }
};

const translator = (type) => { // Traduit en français les type en anglais (teddies=>ourson)
    switch (type) {
        case 'teddies':
            return "Oursons";

        case 'cameras':
            return "Caméras";


        case 'furniture':
            return "Meubles en chênes";
    
        default:
            return "Erreur";
    }
};