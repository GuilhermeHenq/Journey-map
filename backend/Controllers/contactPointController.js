
const ContactPointModel = require('../Model/ContactPointModel');

const contactPointController = {
  getAllItems: async (req, res) => {
    try {
      const contactPointModel = new ContactPointModel();
      const data = await contactPointModel.getAllItems();
      res.json(data);
    } catch (error) {
      console.error("Error fetching ContactPinsertContactPoints:", error);
      res.status(500).json({ error: 'Erro ao buscar pontos de contato' });
    }
  },

  postItem: async (req, res) => {
    try {
      const postData = req.body;
      if (postData && postData.posX !== undefined) {
        const contactPointModel = new ContactPointModel();
        const dataToInsert = { posX: postData.posX};
        const success = await contactPointModel.insertContactPoint(dataToInsert);

        if (success) {
          res.status(201).json({ message: 'Dados inseridos com sucesso' });
        } else {
          res.status(500).json({ error: 'Erro ao inserir dados' });
        }
      } else {
        res.status(400).json({ error: 'Dados de solicitação POST ausentes ou inválidos' });
      }
    } catch (error) {
      console.error("Error posting ContactPinsertContactPoints:", error);
      res.status(500).json({ error: 'Erro ao inserir ponto de contato' });
    }
  },

  updateItem: async (req, res) => {
    try {
      const putData = req.body;
      if (putData && putData.contactPoint_id !== undefined) {
        const contactPointModel = new ContactPointModel();
        const success = await contactPointModel.updateContactPoint(putData);
      
        if (success) {
          res.status(200).json({ message: 'Dados atualizados com sucesso' });
        } else {
          res.status(500).json({ error: 'Erro ao atualizar os dados' });
        }
      } else {
        res.status(400).json({ error: 'Dados de solicitação PUT ausentes ou inválidos' });
      }
    } catch (error) {
      console.error("Error updating ContactPinsertContactPoints:", error);
      res.status(500).json({ error: 'Erro ao atualizar ponto de contato' });
    }
  }
  
};

module.exports = contactPointController;
