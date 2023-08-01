import express from 'express';
import manager from './productManager.js';
let server = express();
let PORT = 8080;

let ready = async () => {
  console.log('Server ready on port ', PORT);
  await manager.init();
};
server.listen(PORT, ready);

let queryRoute = '/api/products';
let queryFunction = async (req, res) => {
  let limit = req.query.limit;
  if (req.query.limit) {
    let products = await manager.getProducts().slice(0, limit);
    console.log(products);
    if (!products.error) {
      return res.send({ success: true, products });
    } else {
      return res.send({ success: false, msg: 'Cant react products' });
    }
  } else {
    let products = await manager.getProducts();
    if (products.length > 0) {
      return res.send({ success: true, products });
    } else {
      return res.send({ success: false, msg: 'Cant reach products' });
    }
  }
};

let productByIdRoute = '/api/products/:pid';
let productByIdFunction = async (req, res) => {
  let parameter = req.params;
  let id = Number(parameter.pid);

  let one = await manager.getProductById(id);
  if (!one.error) {
    return res.send({
      success: true,
      response: one,
    });
  } else {
    return res.send({
      success: false,
      response: one.message,
    });
  }
};

server.get(queryRoute, queryFunction);
server.get(productByIdRoute, productByIdFunction);
