const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = 5000; // Escolha a porta que desejar

// Middleware para lidar com JSON
app.use(express.json());
app.use(cors());

// Conexão com o MongoDB (certifique-se de ter o MongoDB em execução)
mongoose.connect("mongodb://localhost:27017/squarePos", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema e Modelo do quadrado vermelho
const redStarSchema = new mongoose.Schema({
  x: Number,
});

const RedStar = mongoose.model("position", redStarSchema, "position");

// Rota para obter a posição do quadrado vermelho
app.get("/api/redStar", async (req, res) => {
  try {
    const redStar = await RedStar.findOne({});
    res.json(redStar);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter a posição do quadrado vermelho" });
  }
});
  
  // Rota para atualizar a posição X do quadrado vermelho
  app.put("/api/redStar", async (req, res) => {
    try {
      const { x } = req.body;
      const redStar = await RedStar.findOneAndUpdate({}, { x }, { new: true, upsert: true });
      res.json(redStar);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar a posição X do quadrado vermelho" });
    }
  });  

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});