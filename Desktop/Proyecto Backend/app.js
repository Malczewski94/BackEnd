const express = require('express');

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ProductManager = require('./ProductManager.js');
const productManager = new ProductManager('./Products.json');

app.get('/products', async (req, res) => {
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
  
app.get('/products/:pid', async (req, res) => {
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

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
})