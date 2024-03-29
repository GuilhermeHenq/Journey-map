const db = require('./db');

class ThoughtModel {
  getAllItems() {
    return db.query("SELECT * FROM thought")
      .then(([rows]) => {
        return rows;
      })
      .catch((error) => {
        console.error("Error fetching thought:", error);
        throw error;
      });
  }

  insertThought(data) {
    if (data.posX !== undefined) {
      const { posX, journeyMap_id, linePos, length, description, emojiTag } = data;
      return db.execute("INSERT INTO thought (posX, journeyMap_id, linePos, length, description, emojiTag) VALUES (?, ?, ?, ?, ?, ?)",
      [posX, journeyMap_id, linePos, length, description, emojiTag])
        .then(() => true)
        .catch((error) => {
          console.error("Error inserting thought:", error);
          throw error;
        });
    } else {
      return Promise.resolve(false);
    }
  }
  

  updateThought(data) {
    const { thought_id, posX, description } = data;
  
    return db.execute("UPDATE thought SET posX = ?, description = ? WHERE thought_id = ?", [posX, description, thought_id])
      .then(() => true)
      .catch((error) => {
        console.error("Error updating thought:", error);
        throw error;
      });
  }
  
  deleteThought(thought_id) {
    return db.execute("DELETE FROM thought WHERE thought_id = ?", [thought_id])
      .then(() => true)
      .catch((error) => {
        console.error("Error deleting thought:", error);
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
  
}

module.exports = ThoughtModel;
