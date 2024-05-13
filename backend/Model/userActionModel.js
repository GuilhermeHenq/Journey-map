const db = require('./db');

class UserActionModel {
  getAllItemsByJourneyMapId(journeyMapId) {
    return db.query("SELECT * FROM userAction WHERE journeyMap_id = ?", [journeyMapId])
      .then(([rows]) => {
        return rows;
      })
      .catch((error) => {
        console.error("Error fetching userActions by journeyMapId:", error);
        throw error;
      });
  }

  getAllItems() {
    return db.query("SELECT * FROM userAction")
      .then(([rows]) => {
        return rows;
      })
      .catch((error) => {
        console.error("Error fetching userAction:", error);
        throw error;
      });
  }

  insertUserAction(data) {
    if (data.posX !== undefined) {
      const { posX, journeyMap_id, linePos, length, description, emojiTag } = data;
      return db.execute("INSERT INTO userAction (posX, journeyMap_id, linePos, length, description, emojiTag) VALUES (?, ?, ?, ?, ?, ?)",
      [posX, journeyMap_id, linePos, length, description, emojiTag])
        .then(() => true)
        .catch((error) => {
          console.error("Error inserting userAction:", error);
          throw error;
        });
    } else {
      return Promise.resolve(false);
    }
  }
  

  updateUserAction(data) {
    const { userAction_id, posX, description, width } = data;
  
    return db.execute("UPDATE userAction SET posX = ?, description = ?, length = ? WHERE userAction_id = ?", [posX, description, width, userAction_id])
      .then(() => true)
      .catch((error) => {
        console.error("Error updating userAction:", error);
        throw error;
      });
  }
  
  deleteUserAction(userAction_id) {
    return db.execute("DELETE FROM userAction WHERE userAction_id = ?", [userAction_id])
      .then(() => true)
      .catch((error) => {
        console.error("Error deleting userAction:", error);
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

module.exports = UserActionModel;
