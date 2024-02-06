const express = require('express');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const CartManager = require('../components/CartManager/CartsManager');
const cartManager = new CartManager('./src/Carts.json');
const ProductManager = require('../components/ProductManager/ProductManager');
const productManager = new ProductManager('./src/Products.json');

router.post('/carts', async (req, res) => {
    const { body } = req;
    const newCart = {
        ...body,
    };
    cartManager.addCart(newCart);
    res.status(201).json({ newCart: newCart });
});

router.get('/carts/:cid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    try {
      const cart = await cartManager.getCartById(cartId);
      if (cart) {
        res.json(cart.products);
      } else {
        res.status(404).json({ error: 'Carrito no encontrado.' });
      }
    } catch (error) {
      res.status(404).json({ error: 'Carrito no encontrado.'});
    }
  });

  router.post('/carts/:cid/products/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    
    console.log('CID:', cartId);
    console.log('PID:', productId);

    const product = await productManager.getProductById(productId);
    const cart = await cartManager.getCartById(cartId);
    
    if (!product || !cart) {
        res.status(404).json({ error: 'Producto o carrito no encontrado.' });
        return;
    }
    
    try {
        const updatedCart = await cartManager.updateCart(cartId, productId);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el carrito.' });
    }    res.status(201).json({ message: 'Producto agregado al carrito' });
});

module.exports = router;

