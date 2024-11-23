const fs = require('fs').promises;

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async getProducts() {
        const data = await fs.readFile(this.filePath, 'utf-8');
        return JSON.parse(data);
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(product => product.id === id);
    }

    async addProduct(product) {
        const products = await this.getProducts();
        product.id = Date.now(); // Autogenerar ID
        products.push(product);
        await fs.writeFile(this.filePath, JSON.stringify(products));
        return product;
    }

    async updateProduct(id, updatedFields) {
        let products = await this.getProducts();
        products = products.map(product => 
            product.id === id ? { ...product, ...updatedFields } : product
        );
        await fs.writeFile(this.filePath, JSON.stringify(products));
        return updatedFields;
    }

    async deleteProduct(id) {
        let products = await this.getProducts();
        products = products.filter(product => product.id !== id);
        await fs.writeFile(this.filePath, JSON.stringify(products));
    }
}

module.exports = ProductManager;