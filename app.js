const express = require('express');
const app = express();
const fs = require('fs').promises;

const FILE_PATH = './productos.json';

class ProductManager {
  async getProducts(limit) {
    const data = await fs.readFile(FILE_PATH, 'utf8');
    let products = JSON.parse(data);
    if (limit) {
      products = products.slice(0, limit);
    }
    return products;
  }

  async getProductById(productId) {
    const data = await fs.readFile(FILE_PATH, 'utf8');
    const products = JSON.parse(data);
    const product = products.find((p) => p.id === productId);
    return product;
  }
}

const productManager = new ProductManager();

app.get('/products', async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productManager.getProducts(limit);
    res.send(products);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/products/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productManager.getProductById(productId);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send('Producto no encontrado');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Error interno del servidor');
  }
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
