const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const exphbs = require('express-handlebars');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

let products = []; // Array para almacenar productos

// Configuración de Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Middleware para servir archivos estáticos
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.get('/', (req, res) => {
  res.render('home', { products });
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { products });
});

// Manejar la creación de productos
app.post('/api/products', (req, res) => {
  const product = req.body;
  products.push(product);
  io.emit('productAdded', product); // Emitir evento para nuevos productos
  res.status(201).json(product);
});

// Manejar la eliminación de productos
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  products = products.filter(product => product.id !== id);
  io.emit('productRemoved', id); // Emitir evento para productos eliminados
  res.status(204).end();
});

// Conexión de WebSocket
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Enviar lista de productos a nuevos clientes conectados
  socket.emit('updateProducts', products);

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});