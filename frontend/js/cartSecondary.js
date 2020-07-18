window.onload= () => {
    var inJson2;
    var otherCart= getCart();
    var type= [];
    var newType= [];
    var toSend;
    var itemsToSend= [];
    var send= new XMLHttpRequest();
    document.getElementById('btnSubmit').addEventListener('click', (event)=>{
        event.preventDefault();
        for (let a=0; a<= otherCart.length-1; a++){
            inJson2= JSON.parse(otherCart[a]);
            type.push(inJson2.type);
        }
        newType= removeDuplicates(type);
        for (let index=0; index<=newType.length-1; index++){
            for (let z = 0; z <= otherCart.length-1; z++) {
                inJson2= JSON.parse(otherCart[z]);
                for (let y=1; y <= parseInt(inJson2.quantity); y++) {
                    if (newType[index] === inJson2.type) {
                        itemsToSend.push(inJson2.id);
                    } else {

                    }
                }
            }
            toSend= {
                contact : {
                    firstName  : document.getElementById('firstName').value,
                    lastName   : document.getElementById('lastName').value,
                    adress     : document.getElementById('adress').value,
                    city       : document.getElementById('city').value,
                    email      : document.getElementById('email').value
                },
                products   : itemsToSend
            };

            console.log(toSend);

            console.log(newType[index]);
            send.onreadystatechange = function() {
                if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    console.log(response);
                }
            };
            send.open("POST", "http://localhost:3000/api/"+newType[index]+"/order");
            send.setRequestHeader("Content-Type", "application/json");
            send.send(JSON.stringify(toSend));

            itemsToSend= [];
        }
    });
};