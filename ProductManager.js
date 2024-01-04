const fs = require('fs');
const path = require('path');

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async addProduct(data) {
        const { title, description, price, thumbnail, code, stock } = data;
        if ( !title || !description || !price || !thumbnail || !code || !stock ) {
            throw new Error ('Es necesario completar todos los campos.')
        }

        const products = await getJsonFromFile(this.path); 

        let nextId = 1;
        if (products.length > 0) {
            const ids = products.map(product => product.id);
            nextId = Math.max(...ids) + 1;
        }

        const codeExists = products.some(product => product.code === code);
        if (codeExists) {
            throw new Error('El código del producto ya existe.');
        }


        const newProduct = {
            id: nextId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        products.push(newProduct);

        await saveJsonInFile(this.path, products);
        console.log('El producto se añadio correctamente.');
    }

    getProduct() {
        return getJsonFromFile(this.path);
    }

    async getProductById(id) {
        const product = await getJsonFromFile(this.path);
        const getId = product.findIndex((p) => p.id === id);
        if(getId === -1){
            throw new Error('No se encontro el producto buscado.');
        }
        return product[getId];
    }

    async updateProduct(id, data) {
        const { title, description, price, thumbnail, code, stock } = data;     
        const products = await getJsonFromFile(this.path);
        const position = products.findIndex((p) => p.id === id);
        if (position === -1){
            throw new Error('El producto que desea actualizar no existe.');
        }
        if (title) {
            products[position].title = title;
        }
        if (description) {
            products[position].description = description;
        }
        if (price) {
            products[position].price = price;
        }
        if (thumbnail) {
            products[position].thumbnail = thumbnail;
        }
        if (code) {
            products[position].code = code;
        }
        if (stock) {
            products[position].stock = stock;
        }

        await saveJsonInFile(this.path, products);
        console.log('El producto se a actualizado.');
    }

    async deleteProductById(id) {
        const products = await getJsonFromFile(this.path);
        const indexToDelete = products.findIndex((product) => product.id === id);
    
        if (indexToDelete === -1) {
          throw new Error('No se encontró el producto a eliminar.');
        }
    
        products.splice(indexToDelete, 1);
    
        await saveJsonInFile(this.path, products);
        console.log('El producto se ha eliminado correctamente.');
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

async function test() {
    const productManager = new ProductManager('./Products.json');
    const data = {
        title: 'Producto 1',
        description: 'Descripcion',
        price: 500,
        thumbnail: 'Imagen del producto',
        code: 1234,
        stock: 20,
    };

    // await productManager.addProduct(data); // añade un nuevo produc
    
    // console.log(await productManager.getProduct()); // obtiene todos los productos
    
    // console.log(await productManager.getProductById(1)); // obtiene un producto con el id espesifico

    // await productManager.updateProduct(1, {description: 'Descripcion del producto 1'}); // actualiza el producto
    // console.log(await productManager.getProduct()) // obtiene todos los productos
    
    // await productManager.deleteProductById(6); // elimina un producto
    // console.log(await productManager.getProduct()); // obtiene todos los productos
}

test();