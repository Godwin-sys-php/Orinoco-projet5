window.onload= async () => {
    let allType = getAllType();let total= [];
    var allTotal= [];
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    if (allType.length > 0) {
        let contactInJson= JSON.parse(localStorage.getItem('contact'));
        let h2= document.createElement('h2');
        let p= document.createElement('p');
        h2.textContent= "Information sur le client";
        p.innerHTML= `<strong>Nom</strong>: ${contactInJson.lastName}<br /><strong>Prenom</strong>: ${contactInJson.firstName}<br /><strong>Adresse</strong>: ${contactInJson.address}<br /><strong>Ville</strong>: ${contactInJson.city}<br /><strong>Adresse email</strong>: ${contactInJson.email}<br /><h2>Information sur la commande</h2>`;

        productDiv.appendChild(h2);
        productDiv.appendChild(p);

        for (let i in allType){

            total=[];
            let allItem= localStorage.getItem(`allProduct${allType[i].ucFirst()}`);
            let inJSON= JSON.parse(allItem);
            
            let inFrench= translator(allType[i]);
            let h6= document.createElement('h6');
            h6.innerHTML= `Pour les ${inFrench}:<br />Id de commande: <b>${inJSON.orderId}</b>`;
            productDiv.appendChild(h6);   

            let itemDiv= document.createElement('div');
            itemDiv.className= "row";
            itemDiv.id= "itemDiv"
            productDiv.appendChild(itemDiv);    

            for (let a in inJSON.products){
                objProdut = new Product(allType[i], 'http://localhost:3000/api/');

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

                await objProdut.getProductWithId(inJSON.products[a].id)
                    .then(data => {
                        img.src = data.imageUrl;
                        h5.textContent = data.name;
                        img.width = 150;
                        p.innerHTML = `${data.description}<br /><small class="text-muted">Total: ${data.price*inJSON.products[a].quantity}¢</small><br /><small class="text-muted">Prix: ${data.price}¢</small><br /><small class="text-muted">Pièces: ${inJSON.products[a].quantity}</small>`;
                        total.push(data.price*inJSON.products[a].quantity);
                        
                    }).catch(error => { productDiv.textContent = "Une erreur a eu lieu"; console.error(error); });

                h5.className = "card-title";

                p.className = "card-text";

                divCardBody.innerHTML = '';

                divCardBody.appendChild(img);
                divCardBody.appendChild(h5);
                divCardBody.appendChild(p);
            }

            let newTotal= total.reduce(reducer);
            productDiv.innerHTML+= `<h4 class="text-center">Total: ${newTotal}¢</h4>`;
            allTotal.push(newTotal);
        }
        let generalTotal= allTotal.reduce(reducer);
        productDiv.innerHTML+= `<br /><h3 class="text-center">Merci d'avoir acheté chez Orninoco <br />Total général: ${generalTotal}¢</h3>`;
        localStorage.clear();
    } else {
        window.location= "index.html";
    }
};