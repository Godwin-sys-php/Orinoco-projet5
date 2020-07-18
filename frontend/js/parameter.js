var request = new XMLHttpRequest();
var response;
request.onreadystatechange = function () {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        response = JSON.parse(this.responseText);
        document.getElementsByClassName('image')[0].src = response.imageUrl;
        document.getElementById('nameOfProduct').innerHTML = response.name;
        document.getElementById('description').innerHTML = response.description;
        document.getElementsByClassName('text-muted')[0].innerHTML = response.price + "¢";
        switch ($_GET('type')) {
            case "teddies":
                var perso = response.colors;
                document.getElementById('perso-txt').innerHTML = "Couleur:";
                break;
            case "cameras":
                var perso = response.lenses;
                document.getElementById('perso-txt').innerHTML = "Lentilles:";
                break;
            case "furniture":
                var perso = response.varnish;
                document.getElementById('perso-txt').innerHTML = "Couleur du vernis:";
                break;
        }
        for (let i = 0; i <= perso.length - 1; i++) {
            document.getElementById('perso').innerHTML += "<option value='" + perso[i] + "'>" + perso[i] + "</option>";
        }
    }
};
request.open("GET", "http://localhost:3000/api/" + $_GET('type') + "/" + $_GET("id"));
request.send();

document.getElementsByClassName('btn-success')[0].addEventListener('click', function () {

    let a = localStorage.length;

    let item = {
        key: 'item' + a,
        id: $_GET('id'),
        type: $_GET('type'),
        custom: document.getElementById('perso').value,
        quantity: document.getElementById('quantity').value,
        total: response.price * document.getElementById('quantity').value
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
        newItem.custom = document.getElementById('perso').value;
        newItem.quantity = parseInt(newItem.quantity, 10) + parseInt(document.getElementById('quantity').value, 10);

        localStorage.removeItem(capture);
        localStorage.setItem(capture, JSON.stringify(newItem));
    } else {
        localStorage.setItem('item' + a, JSON.stringify(item));
    }


});