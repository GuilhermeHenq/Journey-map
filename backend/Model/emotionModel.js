// EmotionModel.js

const db = require('./db');

class EmotionModel {
  getAllItemsByJourneyMapId(journeyMapId) {
    return db.query("SELECT * FROM emotion WHERE journeyMap_id = ?", [journeyMapId])
      .then(([rows]) => {
        return rows;
      })
      .catch((error) => {
        console.error("Error fetching emotions by journeyMapId:", error);
        throw error;
      });
  }

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
    if (data.posX !== undefined && data.lineY !== undefined) {
      const { journeyMap_id, posX, lineY, emojiTag } = data;
      return db.execute("INSERT INTO emotion (journeyMap_id, posX, lineY, emojiTag) VALUES (?, ?, ?, ?)", 
      [journeyMap_id, posX, lineY, emojiTag])
        .then(async () => {
          const [rows] = await db.query("SELECT LAST_INSERT_ID() as last_inserted_id");
          return rows[0].last_inserted_id;
        })
        .catch((error) => {
          console.error("Error inserting emotion:", error);
          throw error;
        });
    } else {
      return Promise.resolve(false);
    }
  }
  

  updateEmotion(data) {
    const { emotion_id, posX, lineY, emojiTag } = data;

    if (emotion_id === undefined || posX === undefined || lineY === undefined) {
      console.error("Missing required fields for updating emotion:", { emotion_id, posX, lineY });
      throw new Error("Missing required fields for updating emotion");
    }

    let query = "UPDATE emotion SET posX = ?, lineY = ?";
    const queryParams = [posX, lineY];

    if (emojiTag !== undefined) {
      query += ", emojiTag = ?";
      queryParams.push(emojiTag);
    }

    query += " WHERE emotion_id = ?";
    queryParams.push(emotion_id);

    return db.execute(query, queryParams)
      .then(() => true)
      .catch((error) => {
        console.error("Error updating emotion:", error);
        throw error;
      });
  }

  deleteEmotion(emotion_id) {
    return db.execute("DELETE FROM emotion WHERE emotion_id = ?", [emotion_id])
      .then(() => true)
      .catch((error) => {
        console.error("Error deleting emotion:", error);
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
    return db.execute("DELETE FROM emotion WHERE journeyMap_id = ?", [journeyMapId])
    .then(() => true)
    .catch((error) => {
      console.error("Error deleting emotion:", error);
      throw error;
    });
  }
  
}

module.exports = EmotionModel;
