let inJson2;
let cart = getCart();
let type = [];
let newType = [];
let toSend;
let itemsToSend = [];
btnSubmit.addEventListener('click', async (event) => {
    event.preventDefault();
    let verification= false;
    let allInput= [firstName, lastName, adress, city, email];
    for (let input = 0; input <= 4; input++) {
        if (input == 4) {
            if (isNotAValidEmail(allInput[input].value)) {    
                verification = true;
                allInput[input].className = 'form-control is-invalid';
            } else {
                allInput[input].className = 'form-control is-valid';
            }
        } else {
            if (isEmpty(allInput[input].value)) {
                verification = true;
                allInput[input].className = 'form-control is-invalid';
            } else {
                allInput[input].className = 'form-control is-valid';
            }
        }
        if (getCart().length == 0) {
            verification = true;
            $('#error').modal('show');
            form.className= "d-none";
        }
    }
    if (!verification) {
        for (let a in cart) {
            inJson2 = JSON.parse(cart[a]);
            type.push(inJson2.type);
        }
        newType = removeDuplicates(type);
        //console.log(newType);
        for (let index in newType) {
            for (let z in cart) {
                inJson2 = JSON.parse(cart[z]);
                for (let y = 1; y <= parseInt(inJson2.quantity); y++) {
                    if (newType[index] == inJson2.type) {
                        itemsToSend.push(inJson2.id);
                    }
                }
            }
            toSend = {
                contact: {
                    firstName: firstName.value,
                    lastName: lastName.value,
                    address: adress.value,
                    city: city.value,
                    email: email.value
                },
                products: itemsToSend
            };
            var status;
            index == newType.length-1 ? status= true : status= false;
            send(toSend, newType[index], status);

            toSend= {};
            itemsToSend= [];
        }
    } 
});