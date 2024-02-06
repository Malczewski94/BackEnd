const express = require('express');
const path = require('path');
const products = require('./Products.json');
const handlebars = require('express-handlebars');
const productsRouter = require('./routers/products.router');
const indexRouter = require('./routers/index.router');
const cartsRouter = require('./routers/carts.router'); 
const ProductManager = require('./components/ProductManager/ProductManager.js');
const productManager = new ProductManager('./src/Products.json');
const http = require('http');
const {Server} = require('socket.io');

let product = []

const app = express();
const port = 8080;

const server = http.createServer(app);

app.use(express.static(__dirname + '/public'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use('/', indexRouter);
app.use('/api', productsRouter, cartsRouter);
//app.use('/:pid', indexRouter);

app.use((error, req, res, next) => {
  const message = `A ocurrido un error: ${error.message}`;
  console.error(message);
  res.status(500).json({ message });
})

app.get('/', (req, res) =>{
  res.render('index', { title: 'eCommenrce', products })
});

app.get('/realtimeproducts', (req, res) =>{
  res.render('realtimeproducts', { title: 'eCommenrce' })
});

const io = new Server(server);
io.on('connection', (socket) =>{
  console.log('Hola nuevo cliente')
  socket.emit('nuevoProducto', 'Bienvenido cliente nuevo');
  
  io.sockets.emit('allProduct', products);

  // socket.on('newPdt', (data) =>{
  //   console.log(data)
  //   product.push(data)
  //   io.sockets.emit('allProducts', product)
  // }) 

  socket.on("newPdt", async (data) => {
    try { 
      const product = await productManager.addProduct(data);
      socket.emit("allProduct", product);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("delPdt", async (idObject) => {
    const id = idObject.idPdt;
    console.log(id)
    try { 
      const product = await productManager.deleteProductById(id);
      socket.emit("allProducts", product);
    } catch (error) {
      console.log(error);
    }
  });


})

server.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
})
