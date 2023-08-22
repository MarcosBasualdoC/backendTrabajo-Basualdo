const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.productIdCounter = 1;
        this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
            this.updateProductIdCounter();
        } catch (error) {
            this.products = [];
            this.productIdCounter = 1;
        }
    }

    updateProductIdCounter() {
        if (this.products.length > 0) {
            const lastProduct = this.products[this.products.length - 1];
            this.productIdCounter = lastProduct.id + 1;
        } else {
            this.productIdCounter = 1;
        }
    }

    saveProducts() {
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf8');
    }

    addProduct(productData) {
        if (!this.validateProductData(productData)) {
            console.log("Error: datos de producto no válidos");
            return;
        }

        const existingProduct = this.products.find(product => product.code === productData.code);
        if (existingProduct) {
            console.log("Error: Ya existe un producto con el mismo código");
            return;
        }

        const newProduct = {
            id: this.productIdCounter++,
            ...productData
        };

        this.products.push(newProduct);
        this.saveProducts();
        console.log("Producto añadido con éxito:", newProduct);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            console.log("Error: Producto no encontrado");
            return;
        }

        return product;
    }

    updateProduct(id, updatedFields) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) {
            console.log("Error: Producto no encontrado");
            return;
        }

        this.products[productIndex] = {
            ...this.products[productIndex],
            ...updatedFields
        };

        this.saveProducts();
        console.log("Producto actualizado con éxito:", this.products[productIndex]);
    }

    deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) {
            console.log("Error: Producto no encontrado");
            return;
        }

        const deletedProduct = this.products.splice(productIndex, 1)[0];
        this.saveProducts();
        console.log("Producto eliminado con éxito:", deletedProduct);
    }

    validateProductData(productData) {
        const requiredFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
        return requiredFields.every(field => productData.hasOwnProperty(field));
    }
}

module.exports = ProductManager;
