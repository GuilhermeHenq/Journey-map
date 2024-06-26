const db = require('./db');

class JourneyPhaseModel {
  getAllItemsByJourneyMapId(journeyMapId) {
    return db.query("SELECT * FROM journeyPhase WHERE journeyMap_id = ?", [journeyMapId])
      .then(([rows]) => {
        return rows;
      })
      .catch((error) => {
        console.error("Error fetching journeyPhases by journeyMapId:", error);
        throw error;
      });
  }

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
      const { posX, journeyMap_id, linePos, length, description, emojiTag } = data;
      return db.execute("INSERT INTO journeyPhase (posX, journeyMap_id, linePos, length, description, emojiTag) VALUES (?, ?, ?, ?, ?, ?)",
      [posX, journeyMap_id, linePos, length, description, emojiTag])
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
    const { journeyPhase_id, posX, description, width } = data;
  
    return db.execute("UPDATE journeyPhase SET posX = ?, description = ?, length = ? WHERE journeyPhase_id = ?", [posX, description, width, journeyPhase_id ])
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

  getLastInsertedId() {
    return db.query("SELECT LAST_INSERT_ID() as last_inserted_id")
      .then(([rows]) => {
        return rows[0].last_inserted_id;
      })
      .catch((error) => {
        console.error("Error getting last inserted ID:", error);
        throw error;
      });
  }

  deleteByJourneyMapId(journeyMapId) {
    return db.execute("DELETE FROM journeyPhase WHERE journeyMap_id = ?", [journeyMapId])
    .then(() => true)
    .catch((error) => {
      console.error("Error deleting journeyPhase:", error);
      throw error;
    });
  }
  
}

module.exports = JourneyPhaseModel;
