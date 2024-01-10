const db = require('./db'); // Importa o módulo de configuração do banco de dados

class ThoughtModel {
  getAllItems() {
    return db.query("SELECT * FROM thought")
      .then(([rows]) => {
        return rows;
      })
      .catch((error) => {
        console.error("Error fetching thoughts:", error);
        throw error;
      });
  }

  insertThought(data) {
    // Certifique-se de que `data` contenha os campos necessários antes da inserção
    if (data.posX !== undefined) {
      const { posX, linePos = 0 } = data; // Define um valor padrão se 'linePos' não estiver presente

      // Execute a instrução SQL para inserção
      return db.execute("INSERT INTO thought (posX, linePos) VALUES (?, ?)", [posX, linePos])
        .then(() => true) // Inserção bem-sucedida
        .catch((error) => {
          console.error("Error inserting thought:", error);
          throw error;
        });
    } else {
      return Promise.resolve(false); // Campos necessários ausentes
    }
  }

  updateThought(data) {
    const { thought_id, posX } = data;

    // Atualize a instrução SQL
    return db.execute("UPDATE thought SET posX = ? WHERE thought_id = ?", [posX, thought_id])
      .then(() => true) // Atualização bem-sucedida
      .catch((error) => {
        console.error("Error updating thought:", error);
        throw error;
      });
  }
}

module.exports = ThoughtModel;
