// emotionController.js

const EmotionModel = require('../Model/emotionModel');

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
      if (postData && postData.posX !== undefined
        && postData.journeyMap_id !== undefined 
        && postData.emojiTag !== undefined
        && postData.lineY !== undefined) {
        const emotionModel = new EmotionModel();
        const success = await emotionModel.insertEmotion(postData);

        if (success) {
          const insertedId = await emotionModel.getLastInsertedId();
          res.status(201).json({ id: insertedId, message: 'Dados inseridos com sucesso' });
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
  },

  deleteItem: async (req, res) => {
    try {
      const deleteData = req.body;
      if (deleteData && deleteData.emotion_id !== undefined) {
        const emotionModel = new EmotionModel();
        const success = await emotionModel.deleteEmotion(deleteData.emotion_id);

        if (success) {
          res.status(200).json({ message: 'Emoção excluído com sucesso' });
        } else {
          res.status(500).json({ error: 'Erro ao excluir a emoção' });
        }
      } else {
        res.status(400).json({ error: 'Dados de solicitação DELETE ausentes ou inválidos' });
      }
    } catch (error) {
      console.error("Error deleting emotion:", error);
      res.status(500).json({ error: 'Erro ao excluir emoção' });
    }
  }
  
};

module.exports = emotionController;
