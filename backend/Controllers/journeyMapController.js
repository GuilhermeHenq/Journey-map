// journeyMapController.js
const JourneyMapModel = require('../Model/journeyMapModel');

const journeyMapController = {
  createMap: async (req, res) => {
    try {
      const postData = req.body;
      const journeyMapModel = new JourneyMapModel();
      const journeyMap = await journeyMapModel.createNewMap(postData.uid, postData.name);
      res.status(201).json({ journeyMap, message: 'Novo mapa criado com sucesso' });
    } catch (error) {
      console.error("Error creating new journey map:", error);
      res.status(500).json({ error: 'Erro ao criar novo mapa' });
    }
  },

  getUserMaps: async (req, res) => {
    try {
      const uid = req.query.uid;
      const journeyMapModel = new JourneyMapModel();
      const userMaps = await journeyMapModel.getUserMaps(uid);
      res.status(200).json({ userMaps });
    } catch (error) {
      console.error("Error getting user maps:", error);
      res.status(500).json({ error: 'Erro ao obter mapas do usuário' });
    }
  },

  updateMapName: async (req, res) => {
    try {
      const { userId, newName } = req.body;
      const journeyMapModel = new JourneyMapModel();
      const success = await journeyMapModel.updateMapName(userId, newName);
      if (success) {
        res.status(200).json({ message: 'Nome do mapa atualizado com sucesso' });
      } else {
        res.status(404).json({ error: 'Mapa não encontrado ou não foi possível atualizar o nome' });
      }
    } catch (error) {
      console.error("Error updating map name:", error);
      res.status(500).json({ error: 'Erro ao atualizar o nome do mapa' });
    }
  },

  deleteUserMaps: async (req, res) => {
    try {
      const userId = req.params.userId;
      const journeyMapModel = new JourneyMapModel();
      const success = await journeyMapModel.deleteUserMaps(userId);
      if (success) {
        res.status(200).json({ message: 'Mapas do usuário excluídos com sucesso' });
      } else {
        res.status(404).json({ error: 'Mapas do usuário não encontrados ou não foi possível excluir' });
      }
    } catch (error) {
      console.error("Error deleting user maps:", error);
      res.status(500).json({ error: 'Erro ao excluir os mapas do usuário' });
    }
  }
};

module.exports = journeyMapController;
