const JourneyPhaseModel = require('../Model/journeyPhaseModel');

const journeyPhaseController = {
  getAllItems: async (req, res) => {
    try {
      const journeyPhaseModel = new JourneyPhaseModel();
      const data = await journeyPhaseModel.getAllItems();
      res.json(data);
    } catch (error) {
      console.error("Error fetching JourneyPhase:", error);
      res.status(500).json({ error: 'Erro ao buscar fases da jornada' });
    }
  },

  postItem: async (req, res) => {
    try {
      const postData = req.body;
      if (postData && postData.posX !== undefined && postData.journeyMap_id
        !== undefined && postData.linePos !== undefined && postData.length !== undefined &&
        postData.description !== undefined && postData.emojiTag !== undefined) {
        const journeyPhaseModel = new JourneyPhaseModel();
        const success = await journeyPhaseModel.insertJourneyPhase(postData);

        if (success) {
          const insertedId = await journeyPhaseModel.getLastInsertedId();
          res.status(201).json({ id: insertedId, message: 'Dados inseridos com sucesso' });
        } else {
          res.status(500).json({ error: 'Erro ao inserir dados' });
        }
      } else {
        res.status(400).json({ error: 'Dados de solicitação POST ausentes ou inválidos' });
      }
    } catch (error) {
      console.error("Error posting JourneyPhase:", error);
      res.status(500).json({ error: 'Erro ao inserir fases da jornada' });
    }
  },

  updateItem: async (req, res) => {
    try {
      const putData = req.body;
      if (putData && putData.journeyPhase_id !== undefined) {
        const journeyPhaseModel = new JourneyPhaseModel();
        const success = await journeyPhaseModel.updateJourneyPhase(putData);

        if (success) {
          res.status(200).json({ message: 'Dados atualizados com sucesso' });
        } else {
          res.status(500).json({ error: 'Erro ao atualizar os dados' });
        }
      } else {
        res.status(400).json({ error: 'Dados de solicitação PUT ausentes ou inválidos' });
      }
    } catch (error) {
      console.error("Error updating JourneyPhase:", error);
      res.status(500).json({ error: 'Erro ao atualizar fases da jornada' });
    }
  },

  deleteItem: async (req, res) => {
    try {
      const journeyPhaseId = req.params.journeyPhaseId; // Pega o id diretamente da URL
      const journeyPhaseModel = new JourneyPhaseModel();
      const success = await journeyPhaseModel.deleteJourneyPhase(journeyPhaseId);

      if (success) {
        res.status(200).json({ message: 'Fase da jornada excluída com sucesso' });
      } else {
        res.status(500).json({ error: 'Erro ao excluir a Fase da jornada' });
      }
    } catch (error) {
      console.error("Error deleting JourneyPhase:", error);
      res.status(500).json({ error: 'Erro ao excluir Fase da jornada' });
    }
  }

};

module.exports = journeyPhaseController;
