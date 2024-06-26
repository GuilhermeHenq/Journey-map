// emotionController.js

const EmotionModel = require('../Model/emotionModel');

const emotionController = {
  getAllItems: async (req, res) => {
    try {
      const journeyMapId = req.query.journeyMap_id; // Extrair o journeyMap_id dos parâmetros de consulta
      if (!journeyMapId) {
        return res.status(400).json({ error: 'Parâmetro journeyMap_id ausente na solicitação' });
      }

      const emotionModel = new EmotionModel();
      const data = await emotionModel.getAllItemsByJourneyMapId(journeyMapId);
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
        const insertedId = await emotionModel.insertEmotion(postData);
  
        if (insertedId) {
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
      const emotionId = req.params.emotionId; // Pega o id diretamente da URL
      const emotionModel = new EmotionModel();
      const success = await emotionModel.deleteEmotion(emotionId);

      if (success) {
        res.status(200).json({ message: 'Emoção excluída com sucesso' });
      } else {
        res.status(500).json({ error: 'Erro ao excluir a Emoção' });
      }
    } catch (error) {
      console.error("Error deleting Emotion:", error);
      res.status(500).json({ error: 'Erro ao excluir Emoção' });
    }
  },

  deleteItemsByJourneyMapId: async (req, res) => {
    try {
      const putData = req.body;
      const journeyMapId = putData.journeyMap_id;
      const emotionModel = new EmotionModel();
      const success = await emotionModel.deleteByJourneyMapId(journeyMapId);
      
      if (success) {
        res.status(200).json({ message: 'Emoções excluídas com sucesso' });
      } else {
        res.status(404).json({ error: 'Nenhuma emoção encontrada para o mapa fornecido' });
      }
    } catch (error) {
      console.error("Error deleting emotion by journeyMapId:", error);
      res.status(500).json({ error: 'Erro ao excluir emoções' });
    }
  }
  
};

module.exports = emotionController;
