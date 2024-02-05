const db = require('./db');

class JourneyPhaseModel {
  getAllItems() {
    return db.query("SELECT * FROM journeyPhase")
      .then(([rows]) => {
        return rows;
      })
      .catch((error) => {
        console.error("Error fetching journeyPhase:", error);
        throw error;
      });
  }

  insertJourneyPhase(data) {
    if (data.posX !== undefined) {
      const { posX } = data;
      return db.execute("INSERT INTO journeyPhase (posX) VALUES (?)", [posX])
        .then(() => true)
        .catch((error) => {
          console.error("Error inserting journeyPhase:", error);
          throw error;
        });
    } else {
      return Promise.resolve(false);
    }
  }
  

  updateJourneyPhase(data) {
    const { journeyPhase_id, posX } = data;
  
    return db.execute("UPDATE journeyPhase SET posX = ? WHERE journeyPhase_id = ?", [posX, journeyPhase_id])
      .then(() => true)
      .catch((error) => {
        console.error("Error updating journeyPhase:", error);
        throw error;
      });
  }

  deleteJourneyPhase(journeyPhase_id) {
    return db.execute("DELETE FROM journeyPhase WHERE journeyPhase_id = ?", [journeyPhase_id])
      .then(() => true)
      .catch((error) => {
        console.error("Error deleting journeyPhase:", error);
        throw error;
      });
  }

  
}

module.exports = JourneyPhaseModel;
