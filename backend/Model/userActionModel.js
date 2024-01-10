const db = require('./db'); // Importa o módulo de configuração do banco de dados

class UserActionModel {
  getAllItems() {
    return db.query("SELECT * FROM userAction")
      .then(([rows]) => {
        return rows;
      })
      .catch((error) => {
        console.error("Error fetching user actions:", error);
        throw error;
      });
  }

  insertUserAction(data) {
    // Certifique-se de que `data` contenha os campos necessários antes da inserção
    if (data.posX !== undefined) {
      const { posX, linePos = 0 } = data; // Define um valor padrão se 'linePos' não estiver presente

      // Execute a instrução SQL para inserção
      return db.execute("INSERT INTO userAction (posX, linePos) VALUES (?, ?)", [posX, linePos])
        .then(() => true) // Inserção bem-sucedida
        .catch((error) => {
          console.error("Error inserting user action:", error);
          throw error;
        });
    } else {
      return Promise.resolve(false); // Campos necessários ausentes
    }
  }

  updateUserAction(data) {
    const { userAction_id, posX } = data;

    // Atualize a instrução SQL
    return db.execute("UPDATE userAction SET posX = ? WHERE userAction_id = ?", [posX, userAction_id])
      .then(() => true) // Atualização bem-sucedida
      .catch((error) => {
        console.error("Error updating user action:", error);
        throw error;
      });
  }
}

module.exports = UserActionModel;
