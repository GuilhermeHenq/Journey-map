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
};

module.exports = journeyMapController;
