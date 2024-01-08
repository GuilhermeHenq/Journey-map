const db = require('./db'); // Importa o módulo de configuração do banco de dados

class EmotionModel {
  getAllItems() {
    return db.query("SELECT * FROM emotion")
      .then(([rows]) => {
        return rows;
      })
      .catch((error) => {
        console.error("Error fetching emotions:", error);
        throw error;
      });
  }

  insertEmotion(data) {
    // Certifique-se de que `data` contenha os campos necessários antes da inserção
    if (data.posX !== undefined && data.lineY !== undefined) {
      const { posX, lineY, emojiTag, journeyMapId } = data;

      // Execute a instrução SQL para inserção
      return db.execute("INSERT INTO emotion (journeyMap_id, posX, lineY, emojiTag) VALUES (?, ?, ?, ?)",
        [journeyMapId, posX, lineY, emojiTag])
        .then(() => true) // Inserção bem-sucedida
        .catch((error) => {
          console.error("Error inserting emotion:", error);
          throw error;
        });
    } else {
      return Promise.resolve(false); // Campos necessários ausentes
    }
  }

  updateEmotion(data) {
    const { emotion_id, posX, lineY } = data;

    // Atualize a instrução SQL
    return db.execute("UPDATE emotion SET posX = ?, lineY = ? WHERE emotion_id = ?", [posX, lineY, emotion_id])
      .then(() => true) // Atualização bem-sucedida
      .catch((error) => {
        console.error("Error updating emotion:", error);
        throw error;
      });
  }
}

module.exports = EmotionModel;
