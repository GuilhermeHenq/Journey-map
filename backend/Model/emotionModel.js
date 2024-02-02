// EmotionModel.js

const db = require('./db');

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
    if (data.posX !== undefined && data.lineY !== undefined) {
      const { posX, lineY } = data;
      return db.execute("INSERT INTO emotion (posX, lineY) VALUES (?, ?)", [posX, lineY])
        .then(() => true)
        .catch((error) => {
          console.error("Error inserting emotion:", error);
          throw error;
        });
    } else {
      return Promise.resolve(false);
    }
  }

  updateEmotion(data) {
    const { emotion_id, posX, lineY } = data;
    return db.execute("UPDATE emotion SET posX = ?, lineY = ? WHERE emotion_id = ?", [posX, lineY, emotion_id])
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
}

module.exports = EmotionModel;
