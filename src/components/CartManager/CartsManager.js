const fs = require('fs');
const path = require('path');

class CartsManager {
    constructor(path) {
        this.path = path;
    }

    async addCart(data) {
        const carts = await getJsonFromFile(this.path); 

        let nextId = 1;
        if (carts.length > 0) {
            const ids = carts.map(cart => cart.id);
            nextId = Math.max(...ids) + 1;
        }

        const newCart = {
            id: nextId,
            products: [],
        };
        carts.push(newCart);

        await saveJsonInFile(this.path, carts);
        console.log('El carrito se añadio correctamente.');
    }

    getCart() {
        return getJsonFromFile(this.path);
    }

    async getCartById(id) {
        const cart = await getJsonFromFile(this.path);
        const getId = cart.findIndex((c) => c.id === id);
        console.log('Buscando carrito con id:', id);
        if(getId === -1){
            console.error('No se encontro el carrito buscado.');
        }
        return cart[getId];
    }

//     async updateCart(id, data) {
//         const { products } = data;     
//         const carts = await getJsonFromFile(this.path);
//         const position = carts.findIndex((c) => c.id === id);
//         if (position === -1){
//             throw new Error('El carrito que desea actualizar no existe.');
//         }
//         if (products) {
//             carts[position].products = products;
//         }

//         await saveJsonInFile(this.path, products);
//         console.log('El carrito se a actualizado.');
//     }

async updateCart(cartId, productId) {
    const carts = await getJsonFromFile(this.path);
    
    const cart = carts.find(cart => cart.id === cartId);

    if (cart) {
        const existingProduct = cart.products.find(product => product.id === productId);
        
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({
                id: productId,
                quantity: 1,
            });
        }
    
        await saveJsonInFile(this.path, carts);

        return cart;
    } else {
        throw new Error('Carrito no encontrado.');
    }
}

}

const getJsonFromFile = async (path) => {
    if (!fs.existsSync(path)) {
        return [];
    }
    const content = await fs.promises.readFile(path, 'utf-8');
    return JSON.parse(content);
}

const saveJsonInFile = async (path, data) => {
    const content = JSON.stringify(data, null, '\t');
    await fs.promises.writeFile(path, content, 'utf-8');
}

module.exports = CartsManager;
