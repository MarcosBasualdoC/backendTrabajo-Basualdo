const express = require('express');
const ProductManager = require('./ProductManager');
const app = express();
const port = 3000;

////
const productManager = new ProductManager('./productos.json');

//// 
productManager.addProduct({
    title: 'Remera negra',
    description: 'remera manga corta color negro',
    price: 4000,
    thumbnail: 'imagen1.jpg',
    code: 'P001',
    stock: 20
});

productManager.addProduct({
    title: 'Camisa Blanca',
    description: 'camisa manga larga color blanco',
    price: 5500,
    thumbnail: 'imagen2.jpg',
    code: 'P002',
    stock: 40
});

productManager.addProduct({
    title: 'Jean Azul',
    description: 'Jean chupin de color azul',
    price: 8000,
    thumbnail: 'imagen3.jpg',
    code: 'P003',
    stock: 30
});

////// "/products"
app.get('/products', async (req, res) => {
    const limit = req.query.limit;
    const products = await productManager.getProducts();
    if (limit) {
        const limitedProducts = products.slice(0, limit);
        res.json(limitedProducts);
    } else {
        res.json(products);
    }
});

///// "/products/id"
app.get('/products/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

////
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
