const db = require('./db'); // Importa o módulo de configuração do banco de dados

class JourneyPhaseModel {
  getAllItems() {
    return db.query("SELECT * FROM journeyPhase")
      .then(([rows]) => {
        return rows;
      })
      .catch((error) => {
        console.error("Error fetching journey phases:", error);
        throw error;
      });
  }

  insertJourneyPhase(data) {
    // Certifique-se de que `data` contenha os campos necessários antes da inserção
    if (data.posX !== undefined) {
      const { posX, linePos = 0 } = data; // Define um valor padrão se 'linePos' não estiver presente

      // Execute a instrução SQL para inserção
      return db.execute("INSERT INTO journeyPhase (posX, linePos) VALUES (?, ?)", [posX, linePos])
        .then(() => true) // Inserção bem-sucedida
        .catch((error) => {
          console.error("Error inserting journey phase:", error);
          throw error;
        });
    } else {
      return Promise.resolve(false); // Campos necessários ausentes
    }
  }

  updateJourneyPhase(data) {
    const { journeyPhase_id, posX } = data;

    // Atualize a instrução SQL
    return db.execute("UPDATE journeyPhase SET posX = ? WHERE journeyPhase_id = ?", [posX, journeyPhase_id])
      .then(() => true) // Atualização bem-sucedida
      .catch((error) => {
        console.error("Error updating journey phase:", error);
        throw error;
      });
  }
}

module.exports = JourneyPhaseModel;
