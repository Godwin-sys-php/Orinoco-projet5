class Product {
    constructor(type, url) {
        this.type = type;
        this.url = url;
    }

    getAllProduct() {
        return new Promise((resolve, reject) => {
            fetch(`${this.url}${this.type}`, { method: 'GET' })
                .then(response => response.json())
                .then(data => resolve(data)).catch(error => reject(error));
        });
    }

    getProductWithId(id) {
        return new Promise((resolve, reject) => {
            fetch(`${this.url}${this.type}/${id}`, { method: 'GET' })
                .then(response => response.ok ? response.json() : reject(response))
                .then(data => resolve(data)).catch(error => reject(error));
        });
    }
}