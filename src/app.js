const express = require('express');
const path = require('path');
const products = require('../Products.json');
const handlebars = require('express-handlebars');
const productsRouter = require('./routers/products.router');
const indexRouter = require('./routers/index.router');
const cartsRouter = require('./routers/carts.router'); 

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use((error, req, res, next) => {
  const message = `A ocurrido un error: ${error.message}`;
  console.error(message);
  res.status(500).json({ message });
})

app.get('/', (req, res) =>{
  res.render('index', { title: 'eCommenrce', products })
});


app.use('/', indexRouter);
app.use('/api', productsRouter, cartsRouter);
app.use('/:pid', indexRouter);

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
})