var request = new XMLHttpRequest();
request.onreadystatechange = function () {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        var response = JSON.parse(this.responseText);
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
            document.getElementById('perso').innerHTML += "<option>" + perso[i] + "</option>";
        }
    }
};
request.open("GET", "http://localhost:3000/api/" + $_GET('type') + "/" + $_GET("id"));
request.send();

document.getElementsByClassName('btn-success')[0].addEventListener('click', function () {
    document.getElementsByClassName('container')[1].innerHTML += '<br /><div class="alert alert-success" role="alert">Ajouté au panier</div>';
});