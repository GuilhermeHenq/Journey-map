const ThoughtModel = require('../Model/thoughtModel');

const thoughtController = {
  getAllItems: async (req, res) => {
    try {
      const thoughtModel = new ThoughtModel();
      const data = await thoughtModel.getAllItems();
      res.json(data);
    } catch (error) {
      console.error("Error fetching thoughtModel:", error);
      res.status(500).json({ error: 'Erro ao buscar pensamentos' });
    }
  },

  postItem: async (req, res) => {
    try {
      const postData = req.body;
      if (postData && postData.posX !== undefined && postData.journeyMap_id 
      !== undefined && postData.linePos !== undefined && postData.length !== undefined && 
      postData.description !== undefined && postData.emojiTag !== undefined) {
        const thoughtModel = new ThoughtModel();
        const success = await thoughtModel.insertThought(postData);

        if (success) {
          const insertedId = await thoughtModel.getLastInsertedId();
          res.status(201).json({ id: insertedId, message: 'Dados inseridos com sucesso' });
        } else {
          res.status(500).json({ error: 'Erro ao inserir dados' });
        }
      } else {
        res.status(400).json({ error: 'Dados de solicitação POST ausentes ou inválidos' });
      }
    } catch (error) {
      console.error("Error posting thoughtModel:", error);
      res.status(500).json({ error: 'Erro ao inserir pensamentos' });
    }
  },

  updateItem: async (req, res) => {
    try {
      const putData = req.body;
      if (putData && putData.thought_id !== undefined) {
        const thoughtModel = new ThoughtModel();
        const success = await thoughtModel.updateThought(putData);
      
        if (success) {
          res.status(200).json({ message: 'Dados atualizados com sucesso' });
        } else {
          res.status(500).json({ error: 'Erro ao atualizar os dados' });
        }
      } else {
        res.status(400).json({ error: 'Dados de solicitação PUT ausentes ou inválidos' });
      }
    } catch (error) {
      console.error("Error updating thought:", error);
      res.status(500).json({ error: 'Erro ao atualizar pensamentos' });
    }
  },

  deleteItem: async (req, res) => {
    try {
      const thoughtId = req.params.thoughtId; // Pega o id diretamente da URL
      const thoughtModel = new ThoughtModel();
      const success = await thoughtModel.deleteThought(thoughtId);
  
      if (success) {
        res.status(200).json({ message: 'Pensamento excluído com sucesso' });
      } else {
        res.status(500).json({ error: 'Erro ao excluir o pensamento' });
      }
    } catch (error) {
      console.error("Error deleting Thought:", error);
      res.status(500).json({ error: 'Erro ao excluir pensamento' });
    }
}
  
};

module.exports = thoughtController;
