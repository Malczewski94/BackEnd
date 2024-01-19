const express = require('express');
const ProductManager = require('../components/ProductManager/ProductManager.js');
const productManager = new ProductManager('./Products.json');

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.post('/', async (req, res) => {
    const { body } = req;
    const newProduct = {
        ...body,
    };
    productManager.addProduct(newProduct);
    res.status(201).json({ newProduct });
});

router.put('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const { body } = req;
    productManager.updateProduct(productId, body);
    res.status(404).json({ message: 'Producto actualizado exitosamente' });
});

router.delete('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const { body } = req;
    productManager.deleteProductById(productId, body);

    res.status(404).json({ message: 'Producto eliminado exitosamente' });
});

module.exports = router;
