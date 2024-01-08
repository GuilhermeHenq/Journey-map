const express = require('express');
const app = express();
const port = 3000; // Ou a porta desejada

app.use(express.json());

// Configuração do CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.route('/:controller')
  .get((req, res) => {
    const controller = req.params.controller;
    const controllerFileName = `../Controllers/${controller}Controller`;

    try {
      const controllerInstance = require(controllerFileName);

      if (req.query.method && typeof controllerInstance[req.query.method] === 'function') {
        controllerInstance[req.query.method](req, res);
      } else {
        res.status(404).json({ error: 'Método não encontrado' });
      }

      console.log(`Controller: ${controller}`);
      console.log(`Controller FileName: ${controllerFileName}`);
    } catch (error) {
      console.error(`Error loading controller: ${controllerFileName}`, error);
      res.status(404).json({ error: 'Controlador não encontrado' });
    }
  })
  .put((req, res) => {
    const controller = req.params.controller;
    const controllerFileName = `./Controllers/${controller}Controller`;

    try {
      const controllerInstance = require(controllerFileName);

      if (req.query.method && typeof controllerInstance[req.query.method] === 'function') {
        console.log(`Controller and method loaded successfully: ${controllerFileName}.${req.query.method}`);
        controllerInstance[req.query.method](req, res);
      } else {
        console.log(`Method not found: ${controllerFileName}.${req.query.method}`);
        res.status(404).json({ error: 'Método não encontrado' });
      }
    } catch (error) {
      console.log(`Error loading controller: ${controllerFileName}`);
      res.status(404).json({ error: 'Controlador não encontrado' });
    }
  });

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
