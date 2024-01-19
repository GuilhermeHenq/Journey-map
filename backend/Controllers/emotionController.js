// emotionController.js

const EmotionModel = require('../Model/EmotionModel');

const emotionController = {
  getAllItems: async (req, res) => {
    try {
      const emotionModel = new EmotionModel();
      const data = await emotionModel.getAllItems();
      res.json(data);
    } catch (error) {
      console.error("Error fetching emotions:", error);
      res.status(500).json({ error: 'Erro ao buscar emoções' });
    }
  },

  postItem: async (req, res) => {
    try {
      const postData = req.body;
      if (postData && postData.posX !== undefined) {
        const emotionModel = new EmotionModel();
        const dataToInsert = { posX: postData.posX, lineY: postData.lineY };
        const success = await emotionModel.insertEmotion(dataToInsert);

        if (success) {
          res.status(201).json({ message: 'Dados inseridos com sucesso' });
        } else {
          res.status(500).json({ error: 'Erro ao inserir dados' });
        }
      } else {
        res.status(400).json({ error: 'Dados de solicitação POST ausentes ou inválidos' });
      }
    } catch (error) {
      console.error("Error posting emotions:", error);
      res.status(500).json({ error: 'Erro ao inserir emoção' });
    }
  },

  updateItem: async (req, res) => {
    try {
      const putData = req.body;
      if (putData && putData.emotion_id !== undefined) {
        const emotionModel = new EmotionModel();
        const success = await emotionModel.updateEmotion(putData);

        if (success) {
          res.status(200).json({ message: 'Dados atualizados com sucesso' });
        } else {
          res.status(500).json({ error: 'Erro ao atualizar os dados' });
        }
      } else {
        res.status(400).json({ error: 'Dados de solicitação PUT ausentes ou inválidos' });
      }
    } catch (error) {
      console.error("Error updating emotions:", error);
      res.status(500).json({ error: 'Erro ao atualizar emoção' });
    }
  }
};

module.exports = emotionController;
