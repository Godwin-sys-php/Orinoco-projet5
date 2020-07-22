window.onload= async () => {
    var cart = getCart();// On mets les localStorage dans un tableau
    var allTotal = [];
    var json;
    let objProdut;
    if (cart.length == 0){
        productDiv.className="text-center";
        productDiv.innerHTML="<h6 class='text-center'>Votre panier est malheuresement vide!</h6>";
    } else {
        for (let i in cart) {
            json = JSON.parse(cart[i]);// On parse le JSON
            objProdut = new Product(json.type, 'http://localhost:3000/api/');

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

            //Et le plus logique serait de faire :
            //console.log(response);
            await objProdut.getProductWithId(json.id)
                .then(data => {
                    img.src = data.imageUrl;
                    h5.textContent = data.name;
                    img.width = 150;
                    p.innerHTML = `${data.description}<br /><small class="text-muted">${json.customTxt} ${json.custom}</small><br /><small class="text-muted" id="total${json.key}">Total: ${json.total}¢</small><br /><small class="text-muted">Prix: ${data.price}¢</small><br /><small class="text-muted" id="quantity_${json.key}">Pièces: ${json.quantity}</small><br /><button class="btn btn-danger btn-sm" onclick="decrease(\'${json.key}\', ${data.price});"> - </button> <button class="btn btn-primary btn-sm" onclick="increase(\'${json.key}\', ${data.price});"> + </button><br /><br /><button class="btn btn-danger btn-block" onclick="localStorage.removeItem(\'${json.key}\');window.location.reload();">Retirer</button>`;
                }).catch(error => { productDiv.textContent = "Une erreur a eu lieu"; console.error(error); });

            h5.className = "card-title";

            p.className = "card-text";

            allTotal.push(json.total);

            divCardBody.innerHTML = '';

            //On crée des éléments 

            divCardBody.appendChild(img);
            divCardBody.appendChild(h5);
            divCardBody.appendChild(p);
            if (i == cart.length - 1) {
                totalDiv.innerHTML = `<br /><h3 class="text-center" id="totalH3">Total: ${getTotalOfCart()}¢</h3><br /><button class="btn btn-warning btn-block btn-lg" onclick="clean();">Vider le panier</button><button class="btn btn-success btn-block btn-lg" onclick="document.getElementsByClassName(\'d-none\')[0].className=\'visible\';this.className=\'d-none\';">Passer la commande</button>`;
            }
        }
    }
};