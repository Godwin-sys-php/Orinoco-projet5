var perso, customTxt;
let objProduct = new Product($_GET('type'), 'http://localhost:3000/api/');
imageDiv.innerHTML = '<div class="col text-center"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div>';
nameOfProduct.innerHTML = '<div class="col text-center"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div>';
description.innerHTML = '<div class="col text-center"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div>';
price.innerHTML = '<div class="col text-center"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div>';
addToCart.disabled= true;
objProduct.getProductWithId($_GET('id'))
    .then(data => {
        addToCart.disabled= false;
        imageDiv.innerHTML = '<img class="image" alt="Site logo">';
        document.getElementsByClassName('image')[0].src = data.imageUrl;
        nameOfProduct.textContent = data.name;
        description.textContent = data.description;
        price.innerHTML = data.price + "¢";
        switch ($_GET('type')) {
            case "teddies":
                perso = data.colors;
                customTxt = "Couleur:";
                persoTxt.textContent = "Couleur:";
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
            custom.innerHTML += `<option value="${perso[i]}">${perso[i]}</option>`;
        }
    }).catch(() => { window.location.href = "index.html"; });

addToCart.addEventListener('click', function () {
    if (isInt(quantity.value)) {
        if (perso.includes(custom.value)) {
            let localStorageArray= getCartIndex();
            let a;
            if (localStorageArray.length == 0) {
                a= 1;
            } else {
                localStorageArray= sort(localStorageArray);
                let until= getLastElement(localStorageArray);
                console.log(localStorageArray);
                a= parseInt(until.split('m')[1])+1;
            }
            objProduct.getProductWithId($_GET('id'))
                .then(data => {
                    let item = {
                        key: `item${a}`,
                        id: $_GET('id'),
                        type: $_GET('type'),
                        custom: custom.value,
                        customTxt: customTxt,
                        quantity: quantity.value,
                        total: data.price * quantity.value
                    }

                    let allItem = getCart();
                    let index = 0;
                    let newAllItem;
                    while (index < allItem.length) {
                        newAllItem = JSON.parse(allItem[index]);
                        if (newAllItem.id == item.id) {
                            var verif = false;
                            var capture = newAllItem.key;
                            index = allItem.length;
                        } else {
                            var verif = true;
                            index++;
                        }
                    }

                    if (verif == false) {
                        let newItem = localStorage.getItem(capture);
                        newItem = JSON.parse(newItem);
                        newItem.custom = custom.value;
                        newItem.quantity = parseInt(newItem.quantity, 10) + parseInt(quantity.value, 10);
                        newItem.total = newItem.quantity * data.price;

                        localStorage.removeItem(capture);
                        localStorage.setItem(capture, JSON.stringify(newItem));
                    } else {
                        localStorage.setItem(`item${a}`, JSON.stringify(item));
                    }
                }).catch((error) => { console.log(error); });
                $('#success').modal('show');
        } else {
            $('#error-select').modal('show');
        }
    } else {
        $('#error').modal('show');
    }

});