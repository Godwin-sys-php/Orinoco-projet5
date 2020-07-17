const getAll = () => {
    getAllProduct("teddies");
    getAllProduct("cameras");
    getAllProduct("furniture");
};

const getAllProduct = (restOfUrl) => {
    var request = new XMLHttpRequest();
    request.onload= document.getElementById('product-div').innerHTML = '<div class="col text-center"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div>';
    request.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            document.getElementById('product-div').innerHTML= "";
            var response = JSON.parse(this.responseText);
            for (let i = 0; i <= response.length; i++) {
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

                img.src = response[i].imageUrl;
                img.width = 150;

                h5.className = "card-title";
                h5.innerHTML = response[i].name;

                p.className = "card-text";
                p.innerHTML = response[i].description;

                small.className= "text-muted";
                small.innerHTML= "Prix: "+response[i].price+"¢";

                a.href="parameter.html?id="+response[i]._id+"&type="+restOfUrl;

                btn.className= "btn btn-success";
                btn.innerHTML= '<i class="fas fa-cart-plus"></i> Ajouter au panier';

                document.getElementById('product-div').appendChild(divCol);
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
        }
    };
    request.open("GET", "http://localhost:3000/api/"+restOfUrl);
    request.send();
};



const $_GET= (param) => {
    var vars = {};
    window.location.href.replace( location.hash, '' ).replace( 
        /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
        function( m, key, value ) { // callback
            vars[key] = value !== undefined ? value : '';
        }
    );

    if ( param ) {
        return vars[param] ? vars[param] : null;	
    }
    return vars;
}
