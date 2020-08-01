const getAll = () => {
    getAllProduct("teddies");
    getAllProduct("cameras");
    getAllProduct("furniture");
};

const getAllProduct = async (type) => {
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
                small.innerHTML = "Prix: " + data[i].price + "¢";

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

String.prototype.ucFirst= function(){return this.substr(0,1).toUpperCase()+this.substr(1)};

const $_GET = (param) => {
    var vars = {};
    window.location.href.replace(location.hash, '').replace(
        /[?&]+([^=&]+)=?([^&]*)?/gi, 
        function (m, key, value) {
            vars[key] = value !== undefined ? value : '';
        }
    );

    if (param) {
        return vars[param] ? vars[param] : null;
    }
    return vars;
};

const increase = (key, price) => {
    let now= localStorage.getItem(key);
    nowInJson = JSON.parse(now);

    nowInJson.quantity= parseInt(nowInJson.quantity) + 1;
    nowInJson.total= parseInt(nowInJson.quantity) * price;
    
    localStorage.removeItem(key);
    localStorage.setItem(key, JSON.stringify(nowInJson));

    document.getElementById(`quantity_${key}`).textContent= `Pièces: ${nowInJson.quantity}`;
    document.getElementById(`total${key}`).textContent= `Total: ${nowInJson.total}¢`;

    totalH3.textContent= `Total: ${getTotalOfCart()}`;
};

const decrease = (key, price) => {
    let now= localStorage.getItem(key);
    nowInJson = JSON.parse(now);

    nowInJson.quantity= parseInt(nowInJson.quantity) - 1;
    if (nowInJson.quantity > 0) { 
        nowInJson.total= parseInt(nowInJson.quantity) * price;
        
        localStorage.removeItem(key);
        localStorage.setItem(key, JSON.stringify(nowInJson));

        document.getElementById(`quantity_${key}`).textContent= `Pièces: ${nowInJson.quantity}`;
        document.getElementById(`total${key}`).textContent= `Total: ${nowInJson.total}¢`;

        totalH3.textContent= `Total: ${getTotalOfCart()}`;
    } else {
        localStorage.removeItem(key);
        window.location.reload();
    }
};

const clean = () => {
    if (confirm('Voulez vous vraiment vider votre panier?')){
        let cart= getCart();
        for (let index in cart) {
            inJson=  JSON.parse(cart[index]);
            localStorage.removeItem(inJson.key);
        }
        window.location.reload();
    }
};

const getCart = () => {
    let toReturn = [];
    for (let index = 0; index <= localStorage.length - 1; index++) {
        if (localStorage.key(index).substring(0, 4) == 'item') {
            toReturn.push(localStorage.getItem(localStorage.key(index)));
        }
    }
    return toReturn;
};

const getCartIndex = () => {
    let toReturn = [];
    for (let index = 0; index <= localStorage.length - 1; index++) {
        if (localStorage.key(index).substring(0, 4) == 'item') {
            toReturn.push(localStorage.key(index));
        }
    }
    return toReturn;
};

const removeDuplicates = (array) => {
    let unique = {};
    array.forEach(function (i) {
        if (!unique[i]) {
            unique[i] = true;
        }
    });
    return Object.keys(unique);
};

const countElement = (array, element) => {
    let a= 0;
    for (let i in array){
        if (array[i] == element) {
            a++
        }
    }
    return a;
};

const removeDuplicateWithName= (array, element) => {
    let compteur= 0;
    let i=-1;
    while (i <= array.length) {
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

const getTotalOfCart = () => {
    let allCart = getCart();
    let total = [];
    for (let index in allCart) {
        let inJson = JSON.parse(allCart[index]);
        total.push(inJson.total);
    }
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    return total.reduce(reducer);
};

const send = async (toSend, type, status) => {
    await fetch(`http://localhost:3000/api/${type}/order`, {
            method: 'post',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(toSend)
        })
        .then(response => response.json())
        .then((data) => {
            let products= [], newProducts= [];
            for (let i in data.products){
                products.push(data.products[i]._id);
            }
            for (let index in products) {
                let a= countElement(products, products[index]);
                newProducts.push({ id: products[index], quantity: a });
                if (a > 1) {
                    removeDuplicateWithName(products, products[index]);
                }
            }
            let obj= {
                orderId: data.orderId,
                products: newProducts
            };
            localStorage.setItem(`allProduct${type.ucFirst()}`, JSON.stringify(obj));
            if (status) {
                localStorage.setItem(`contact`, JSON.stringify(data.contact));
                window.location= "finally.html";
            }
        });
    removeAllItems();
};

const sort = (array) => {
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

const isInt = (value) => {
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

const isEmpty = (value) => {
    if (/[A-Z]|[a-z]|[0-9]/.test(value)) {
        return false;
    } else {
        return true;
    }
};

const isNotAValidEmail = (mail) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return false;
    }
    else {
        return true;
    }
};

const getAllType= () => {
    let array= ['teddies', 'cameras', 'furniture'];
    let toReturn= [];
    for (let index in array) {
        if (localStorage.getItem(`allProduct${array[index].ucFirst()}`) !== null){
            toReturn.push(array[index]);
        }
    }
    return toReturn;
}

const getLastElement = (array) => {
    let a;
    for (let i in array){
        a= array[i];
    }
    return a;
};

const removeAllItems = () => {
    let a= getCartIndex();
    for (let i in a){
        localStorage.removeItem(a[i]);
    }
};

const translator = (type) => {
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

const countDuplicate = (array) => {
    let indices = [];
    let idx;
    for (let element of array) {
        idx = array.indexOf(element);
        while (idx != -1) {
            indices.push(idx);
            idx = array.indexOf(element, idx + 1);
        }
    }

    return indices.length;
};