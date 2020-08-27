window.onload= async () => { //Lors du chargement de la page, on execute cette fonction
    let allType = getAllType();// Lors de l'envoi de la commande, on crée des localStorage pour chaque type, cette fonction sert à récuperer les types et pas les *localStorage* 
    let total= [];
    var allTotal= [];
    const reducer = (accumulator, currentValue) => accumulator + currentValue;// Le reducer
    if (allType.length > 0) { // Si il y a des types, on affiche le récapitulatif
        let contactInJson= JSON.parse(localStorage.getItem('contact'));// On parse le JSON où il y a les informations du client
        //On crée les éléments et on insère les informations du client
        let h2= document.createElement('h2');
        let p= document.createElement('p');
        h2.textContent= "Information sur le client";
        p.innerHTML= `<strong>Nom</strong>: ${contactInJson.lastName}<br /><strong>Prenom</strong>: ${contactInJson.firstName}<br /><strong>Adresse</strong>: ${contactInJson.address}<br /><strong>Ville</strong>: ${contactInJson.city}<br /><strong>Adresse email</strong>: ${contactInJson.email}<br /><h2>Information sur la commande</h2>`;

        productDiv.appendChild(h2);
        productDiv.appendChild(p);

        for (let i in allType){ // On parcours tout les types

            total=[];// On vide le tableau total
            let allItem = localStorage.getItem(`allProduct${ucFirst(allType[i])}`);// On récupère la localStorage du type visé
            let inJSON= JSON.parse(allItem);// On parse la localStorage
            
            let inFrench= translator(allType[i]);// On traduit en français ex: "teddies"=>"Oursons"
            //On insère un id de commande pour chaque type
            let h6= document.createElement('h6');
            h6.innerHTML= `Pour les ${inFrench}:<br />Id de commande: <b>${inJSON.orderId}</b>`;
            productDiv.appendChild(h6);   

            // On crée la div où sera les éléments de la commande

            let itemDiv= document.createElement('div');
            itemDiv.className= "row";
            itemDiv.id= "itemDiv"
            productDiv.appendChild(itemDiv);    

            for (let a in inJSON.products){ // On parcours le tableau products de la localStorage
                objProdut = new Product(allType[i], 'http://localhost:3000/api/');// Une nouvelle instance de la classe Product

                //On prépare les éléments
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
                
                itemDiv.appendChild(divCol);
                divCol.appendChild(divCard);
                divCard.appendChild(divCardBody);

                await objProdut.getProductWithId(inJSON.products[a].id) // On attends la réponse de l'API, qui va nous fournir les informations sur l'article en fonction de l'id contenu dans le tableau products de la localStorage du type
                    .then(data => {
                        img.src = data.imageUrl;
                        h5.textContent = data.name;
                        img.width = 150;
                        p.innerHTML = `${data.description}<br /><small class="text-muted">Total: ${toEuro(data.price*inJSON.products[a].quantity)}€</small><br /><small class="text-muted">Prix: ${toEuro(data.price)}€</small><br /><small class="text-muted">Pièces: ${inJSON.products[a].quantity/*La quantité était stocké dans le tableau structure: [{ id: 1, quantity: 5 }, { id: 2, quantity: 6 }]*/}</small>`;
                        total.push(data.price*inJSON.products[a].quantity);// On ajoute au tableau des totaux le total de l'article
                        
                    }).catch(error => { productDiv.textContent = "Une erreur a eu lieu"; });

                h5.className = "card-title";

                p.className = "card-text";

                divCardBody.innerHTML = '';

                divCardBody.appendChild(img);
                divCardBody.appendChild(h5);
                divCardBody.appendChild(p);
            }

            // À la fin on affiche le tableau des totaux reduit avec tout les éléments additionner
            let newTotal= total.reduce(reducer);
            productDiv.innerHTML+= `<h4 class="text-center">Total: ${toEuro(newTotal)}€</h4>`;
            allTotal.push(newTotal);// On push vers total général
        }
        let generalTotal= allTotal.reduce(reducer);// On le réduit...
        productDiv.innerHTML+= `<br /><h3 class="text-center">Merci d'avoir acheté chez Orninoco <br />Total général: ${toEuro(generalTotal)}€</h3>`;// ...et on l'affiche
        //localStorage.clear();
    } else {// Sinon on fait une redirection
        window.location= "index.html";
    }
};