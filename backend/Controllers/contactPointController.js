// contactPointController.js

const ContactPointModel = require('../Model/ContactPointModel');

const contactPointController = {
  getAllItems: async (req, res) => {
    try {
      const contactPointModel = new ContactPointModel();
      const data = await contactPointModel.getAllItems();
      res.json(data);
    } catch (error) {
      console.error("Error fetching ContactPoints:", error);
      res.status(500).json({ error: 'Erro ao buscar pontos de contato' });
    }
  },

  postItem: async (req, res) => {
    try {
      const postData = req.body;
      if (postData && postData.posX !== undefined && postData.journeyMap_id
        !== undefined && postData.linePos !== undefined && postData.length !== undefined &&
        postData.description !== undefined && postData.emojiTag !== undefined) {
        const contactPointModel = new ContactPointModel();
        const success = await contactPointModel.insertContactPoint(postData);

        if (success) {
          const insertedId = await contactPointModel.getLastInsertedId();
          res.status(201).json({ id: insertedId, message: 'Dados inseridos com sucesso' });
        } else {
          res.status(500).json({ error: 'Erro ao inserir dados' });
        }
      } else {
        res.status(400).json({ error: 'Dados de solicitação POST ausentes ou inválidos' });
      }
    } catch (error) {
      console.error("Error posting ContactPoint:", error);
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
      console.error("Error updating ContactPoint:", error);
      res.status(500).json({ error: 'Erro ao atualizar ponto de contato' });
    }
  },

  deleteItem: async (req, res) => {
    try {
      const contactPointId = req.params.contactPointId; // Pega o id diretamente da URL
      const contactPointModel = new ContactPointModel();
      const success = await contactPointModel.deleteContactPoint(contactPointId);

      if (success) {
        res.status(200).json({ message: 'Ponto de contato excluído com sucesso' });
      } else {
        res.status(500).json({ error: 'Erro ao excluir o Ponto de contato' });
      }
    } catch (error) {
      console.error("Error deleting ContactPoint:", error);
      res.status(500).json({ error: 'Erro ao excluir Ponto de contato' });
    }
  }

};

module.exports = contactPointController;
