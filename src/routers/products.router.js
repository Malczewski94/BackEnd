const express = require('express');
// const { Router } = require('express');
// const path = require('path');

const router = express.Router();
// const router = Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const ProductManager = require('../components/ProductManager/ProductManager.js');
const productManager = new ProductManager('./src/Products.json');

router.get('/products', async (req, res) => {
    try {
      const limit = req.query.limit;
      const products = await productManager.getProduct();
  
      if (limit) {
        console.log(products)
        res.json(products.slice(0, limit));
      } else {
        res.json(products);
      }
    } catch (error) {
      res.json({ error: 'Error al leer los productos.' });
    }
  });
  
router.get('/products/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    const product = await productManager.getProductById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado.' });
    }
  } catch (error) {
    res.json({ error: 'Producto no encontrado.'});
  }
});


module.exports = router;