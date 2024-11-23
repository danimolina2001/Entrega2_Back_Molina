const fs = require('fs').promises;

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async createCart() {
        const carts = await this.getCarts();
        const newCart = { id: Date.now(), products: [] };
        carts.push(newCart);
        await fs.writeFile(this.filePath, JSON.stringify(carts));
        return newCart;
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return []; // Retornar un array vacío si no existe el archivo
        }
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(cart => cart.id === id);
    }

    async addProductToCart(cid, pid, quantity) {
        let carts = await this.getCarts();
        let cart = carts.find(cart => cart.id === cid);

        if (!cart) throw new Error('Carrito no encontrado');

        const existingProductIndex = cart.products.findIndex(p => p.product === pid);

        if (existingProductIndex >= 0) {
            cart.products[existingProductIndex].quantity += quantity; // Incrementar cantidad
        } else {
            cart.products.push({ product: pid, quantity });
        }
        
        carts[carts.indexOf(cart)] = cart; // Actualizar carrito en la lista
        await fs.writeFile(this.filePath, JSON.stringify(carts));
        
        return cart;
    }
}

module.exports = CartManager;