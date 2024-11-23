const express = require('express');
const fs = require('fs');
const ProductManager = require('./ProductManager');
const CartManager = require('./CartManager');

const app = express();
const PORT = 8080;

app.use(express.json());

// Inicializar manejadores
const productManager = new ProductManager('./products.json');
const cartManager = new CartManager('./carts.json');

// Rutas para Manejo de Productos
app.get('/api/products', async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
});

app.get('/api/products/:pid', async (req, res) => {
    const product = await productManager.getProductById(req.params.pid);
    res.json(product);
});

app.post('/api/products', async (req, res) => {
    const newProduct = req.body;
    const addedProduct = await productManager.addProduct(newProduct);
    res.status(201).json(addedProduct);
});

app.put('/api/products/:pid', async (req, res) => {
    const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
    res.json(updatedProduct);
});

app.delete('/api/products/:pid', async (req, res) => {
    await productManager.deleteProduct(req.params.pid);
    res.status(204).send();
});

// Rutas para Manejo de Carritos
app.post('/api/carts', async (req, res) => {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
});

app.get('/api/carts/:cid', async (req, res) => {
    const cart = await cartManager.getCartById(req.params.cid);
    res.json(cart);
});

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
    const { quantity } = req.body;
    const updatedCart = await cartManager.addProductToCart(req.params.cid, req.params.pid, quantity);
    res.json(updatedCart);
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});