// contactPointController.js
const ContactPointModel = require('../model/contactPointModel');

const contactPointController = {
  getAllItems: (req, res) => {
    const contactPointModel = new ContactPointModel();
    contactPointModel.getAllItems()
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        console.error("Error in contactPointController:", error);
        res.status(500).json({ error: 'Erro ao buscar pontos de contato', details: error.message });
      });
  },

  postAllItems: (req, res) => {
    if (req.method === 'POST') {
      // Recebe os dados do corpo da solicitação POST
      const postData = req.body;

      if (postData) {
        // Valida os dados recebidos, certificando-se de que contém os campos necessários
        if (postData.posX !== undefined) {
          // Crie uma instância do modelo de contato 
          const contactPointModel = new ContactPointModel();

          // Prepare os dados a serem inseridos no banco de dados
          const dataToInsert = { posX: postData.posX };

          if (postData.lineY !== undefined) {
            dataToInsert.lineY = postData.lineY;
          }

          // Chame o método do modelo para inserir os dados no banco de dados
          const success = contactPointModel.insertContactPoint(dataToInsert);

          if (success) {
            // Dados inseridos com sucesso, retorne uma resposta de sucesso
            res.status(201).json({ message: 'Dados inseridos com sucesso' });
          } else {
            // Falha ao inserir dados, retorne uma resposta de erro
            res.status(500).json({ error: 'Erro ao inserir dados' });
          }
        } else {
          // Dados de solicitação POST ausentes ou inválidos, retorne uma resposta de erro
          res.status(400).json({ error: 'Dados de solicitação POST ausentes ou inválidos' });
        }
      } else {
        // Falha ao decodificar os dados POST, retorne uma resposta de erro
        res.status(400).json({ error: 'Falha ao decodificar os dados POST' });
      }
    } else {
      // Método de solicitação inválido, retorne uma resposta de erro
      res.status(405).json({ error: 'Método de solicitação inválido' });
    }
  },

  updateAllItems: (req, res) => {
    if (req.method === 'PUT') {
      const putData = req.body;
      
      if (putData && putData.contactPoint_id !== undefined) {
        const contactPointModel = new ContactPointModel();
        const success = contactPointModel.updateContactPoint(putData);

        if (success) {
          res.status(200).json({ message: 'Dados atualizados com sucesso' });
        } else {
          res.status(500).json({ error: 'Erro ao atualizar os dados' });
        }
      } else {
        res.status(400).json({ error: 'Dados de solicitação PUT ausentes ou inválidos' });
      }
    } else {
      res.status(405).json({ error: 'Método de solicitação inválido' });
    }
  }
};

module.exports = contactPointController;
