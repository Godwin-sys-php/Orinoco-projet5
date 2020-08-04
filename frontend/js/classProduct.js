class Product { // Une classe pour simplifier les récupérations API
    constructor(type, url) {// Le type et l'URL sont en paramètres
        this.type = type;
        this.url = url;
    }

    getAllProduct() {// Pour récuperer tout les articles d'un type
        return new Promise((resolve, reject) => {
            fetch(`${this.url}${this.type}`, { method: 'GET' })
                .then(response => response.json())
                .then(data => resolve(data)).catch(error => reject(error));
        });
    }

    getProductWithId(id) {// Pour récuperer un article en fonction d'un type et d'un id
        return new Promise((resolve, reject) => {
            fetch(`${this.url}${this.type}/${id}`, { method: 'GET' })
                .then(response => response.ok ? response.json() : reject(response))
                .then(data => resolve(data)).catch(error => reject(error));
        });
    }
}