const UserActionModel = require('../Model/userActionModel');

const userActionController = {
  getAllItems: async (req, res) => {
    try {
      const userActionModel = new UserActionModel();
      const data = await userActionModel.getAllItems();
      res.json(data);
    } catch (error) {
      console.error("Error fetching userActionModel:", error);
      res.status(500).json({ error: 'Erro ao buscar ações do usuario' });
    }
  },

  postItem: async (req, res) => {
    try {
      const postData = req.body;
      if (postData && postData.posX !== undefined && postData.journeyMap_id 
      !== undefined && postData.linePos !== undefined && postData.length !== undefined && 
      postData.description !== undefined && postData.emojiTag !== undefined) {
        const userActionModel = new UserActionModel();
        const success = await userActionModel.insertUserAction(postData);

        if (success) {
          const insertedId = await userActionModel.getLastInsertedId();
          res.status(201).json({ id: insertedId, message: 'Dados inseridos com sucesso' });
        } else {
          res.status(500).json({ error: 'Erro ao inserir dados' });
        }
      } else {
        res.status(400).json({ error: 'Dados de solicitação POST ausentes ou inválidos' });
      }
    } catch (error) {
      console.error("Error posting userActionModel:", error);
      res.status(500).json({ error: 'Erro ao inserir ações do usuario' });
    }
  },

  updateItem: async (req, res) => {
    try {
      const putData = req.body;
      if (putData && putData.userAction_id !== undefined) {
        const userActionModel = new UserActionModel();
        const success = await userActionModel.updateUserAction(putData);
      
        if (success) {
          res.status(200).json({ message: 'Dados atualizados com sucesso' });
        } else {
          res.status(500).json({ error: 'Erro ao atualizar os dados' });
        }
      } else {
        res.status(400).json({ error: 'Dados de solicitação PUT ausentes ou inválidos' });
      }
    } catch (error) {
      console.error("Error updating userAction:", error);
      res.status(500).json({ error: 'Erro ao atualizar ações do usuario' });
    }
  },

  deleteItem: async (req, res) => {
    try {
      const userActionId = req.params.userActionId; // Pega o id diretamente da URL
      const userActionModel = new UserActionModel();
      const success = await userActionModel.deleteUserAction(userActionId);
  
      if (success) {
        res.status(200).json({ message: 'Ação do usuário excluída com sucesso' });
      } else {
        res.status(500).json({ error: 'Erro ao excluir a Ação do usuário' });
      }
    } catch (error) {
      console.error("Error deleting UserAction:", error);
      res.status(500).json({ error: 'Erro ao excluir Ação do usuário' });
    }
}
  
};

module.exports = userActionController;
