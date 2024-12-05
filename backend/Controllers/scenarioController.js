const ScenarioModel = require('../Model/scenarioModel');

const scenarioController = {
  createScenario: async (req, res) => {
    try {
      const { name, description, journeyMapId } = req.body;
      const scenarioModel = new ScenarioModel();
      const scenario = await scenarioModel.createNewScenario(name, description, journeyMapId);
      res.status(201).json({ scenario, message: 'Novo cenário criado com sucesso' });
    } catch (error) {
      console.error("Error creating new scenario:", error);
      res.status(500).json({ error: 'Erro ao criar novo cenário' });
    }
  },

  getScenarios: async (req, res) => {
    try {
      const journeyMapId = req.params.journeyMapId; // Corrigido para journeyMapId
      const scenarioModel = new ScenarioModel();
      const scenarios = await scenarioModel.getScenariosByJourneyMapId(journeyMapId);
      if (scenarios) {
        res.status(200).json(scenarios);
      } else {
        res.status(404).json({ error: 'Cenário não encontrado' });
      }
    } catch (error) {
      console.error("Error getting scenarios:", error);
      res.status(500).json({ error: 'Erro ao obter cenários' });
    }
  },
  

  updateScenario: async (req, res) => {
    try {
      const { journeyMapId, newName, newDescription } = req.body;
      const scenarioModel = new ScenarioModel();
      const success = await scenarioModel.updateScenario(journeyMapId, newName, newDescription);
      if (success) {
        res.status(200).json({ message: 'Cenário atualizado com sucesso' });
      } else {
        res.status(200).json({ message: 'Cenário atualizado com sucesso' });
      }
    } catch (error) {
      console.error("Error updating scenario:", error);
      res.status(500).json({ error: 'Erro ao atualizar o cenário' });
    }
  }  
};

module.exports = scenarioController;
