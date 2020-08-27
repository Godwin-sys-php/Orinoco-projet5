btnSubmit.addEventListener('click', async (event) => { //Lorsqu'on va cliqué sur le bouton "Confirmer" pour confimer la commande
    
    event.preventDefault();//On annule l'envoie du formulaire

    //On initialise les variable
    var inJson2,
    cart = getCart(),
    type = [],
    newType = [],
    toSend,
    itemsToSend = [];
    
    //On récupère les infomations du client
    var nom= firstName.value.trim(),
    prenom= lastName.value.trim(),
    adresse= adress.value.trim(),
    ville= city.value.trim(),
    mail= email.value.trim();

    let verification= false;// Une variable qui dira si oui ou non le formulaire est correcte
    let allInput= [firstName, lastName, adress, city, email];// Pour se faciliter la tache, on mets dans les éléments dans un tableau 
    for (let input = 0; input <= 4; input++) {// On parcours le tableau
        if (input == 4) {// On fait un traitement uniquement pour l'email
            if (isNotAValidEmail(allInput[input].value.trim())) {    
                verification = true;
                allInput[input].className = 'form-control is-invalid';
            } else {
                allInput[input].className = 'form-control is-valid';
            }
        } else {
            if (isEmpty(allInput[input].value.trim()) || allInput[input].value.trim().length < 2 || !isNotAValidEmail(allInput[input].value.trim()) || parseInt(allInput[input].value.trim()) || parseFloat(allInput[input].value.trim())) {// Si le champs est vide...
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
    if (!verification) {// Si vérification = false donc il n'y a aucune erreur
        container.innerHTML= '<div class="d-flex align-content-center justify-content-center"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div>';// On mets un spinner pour une meilleur expérience utilisateur
        for (let a in cart) { // On parcours le panier
            inJson2 = JSON.parse(cart[a]); // On parse le JSON stringifier
            type.push(inJson2.type);// On mets dans un tableau chaque type
        }
        newType = removeDuplicates(type);// Vue que l'on aura des doublons, on les supprime
        for (let index in newType) { // Pour chaque type, on va faire une requête d'envoie
            for (let z in cart) { // On parcours encore une fois le panier
                inJson2 = JSON.parse(cart[z]);// On parse necore le JSON
                for (let y = 1; y <= parseInt(inJson2.quantity); y++) {// Pour chaque quantité d'un produit...
                    if (newType[index] == inJson2.type) {// ...si son type correspond au type actuel de la boucle parente...
                        itemsToSend.push(inJson2.id);//...on le mets dans itemToSend
                    }
                }
                /*
                    On fait cela pour simuler une quantité.
                    Exemple: Norbert (Ours en peluche) quantité: 5. On va envoyer au serveur l'id de Norbert 5 fois.
                */
            }
            toSend = {
                contact: {
                    firstName: nom,
                    lastName: prenom,
                    address: adresse,
                    city: ville,
                    email: mail
                },
                products: itemsToSend
            };//On construit l'objet
            var status;
            index == newType.length-1 ? status= true : status= false;//Juste pour informer la fonction send si c'est le dernier ou pas (pour faire la redirection)
            send(toSend, newType[index], status);//Et on envoie au serveur, en passant l'objet à envoyer, le type et le status

            //On vide les éléments
            toSend= {};
            itemsToSend= [];
        }
    } 
});