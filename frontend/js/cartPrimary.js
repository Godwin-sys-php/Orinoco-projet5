var cart = getCart();// On mets les localStorage dans un tableau
var allTotal = [];
for (let i = 0; i <= cart.length - 1; i++) {// Une boucle
    //console.log(cart[1]);
    //console.log(newJson);
    var newJson = JSON.parse(cart[i]);
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            var response = JSON.parse(this.responseText);
            newJson = JSON.parse(cart[i]);// On parse le JSON
            let divCol = document.createElement('div');
            let divCard = document.createElement('div');
            let divCardBody = document.createElement('div');
            let img = document.createElement('img');
            let h5 = document.createElement('h5');
            let p = document.createElement('p');

            divCol.className = "col-12 col-lg-4";
            divCard.className = "card";
            divCardBody.className = "card-body";

            //Et le plus logique serait de faire :
            //console.log(response);
            img.src = response.imageUrl;
            img.width = 150;

            h5.className = "card-title";
            h5.innerHTML = response.name;

            //console.log(newJson);
            p.className = "card-text";
            p.innerHTML = response.description + '<br /><small class="text-muted" id="total">Total: ' + newJson.total + '¢</small><br /><small class="text-muted">Prix: ' + response.price + '¢</small><br /><small class="text-muted" id="quantity">Pièces: ' + newJson.quantity + '</small><br /><button class="btn btn-danger btn-block" onclick="localStorage.removeItem(\'' + newJson.key + '\');window.location.reload();">Retirer</button>';

            allTotal.push(newJson.total);

            //On crée des éléments 

            document.getElementById('product-div').appendChild(divCol);
            divCol.appendChild(divCard);
            divCard.appendChild(divCardBody);
            divCardBody.appendChild(img);
            divCardBody.appendChild(h5);
            divCardBody.appendChild(p);
            if (i == cart.length -1) {
                document.getElementById('total-div').innerHTML = '<br /><h3 class="text-center">Total: ' + getTotalOfCart() + '¢</h3><br /><button class="btn btn-success btn-block btn-lg" onclick="document.getElementsByClassName(\'d-none\')[0].className=\'visible\';this.className=\'d-none\';">Passer la commande</button>';
            }
        }
    };
    request.open("GET", "http://localhost:3000/api/" + newJson.type + '/' + newJson.id);
    request.send();
}