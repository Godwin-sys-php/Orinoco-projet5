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



const $_GET = (param) => {
    var vars = {};
    window.location.href.replace(location.hash, '').replace(
        /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
        function (m, key, value) { // callback
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

const removeDuplicates = (array) => {
    let unique = {};
    array.forEach(function (i) {
        if (!unique[i]) {
            unique[i] = true;
        }
    });
    return Object.keys(unique);
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

const send = async (toSend, type) => {
    await fetch(`http://localhost:3000/api/${type}/order`, {
        method: 'post',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(toSend)
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data);
        productDiv.textContent = `Commande effectué avec succès votre numéro de commande: ${data.orderId}`;
        form.innerHTML = '';
        totalDiv.innerHTML = '';
        itemsToSend = [];
    });
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
    if (/[A-Z]|[a-z]/.test(value)) {
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
}