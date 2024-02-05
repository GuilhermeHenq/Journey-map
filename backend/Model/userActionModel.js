const db = require('./db');

class UserActionModel {
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
      const { posX } = data;
      return db.execute("INSERT INTO userAction (posX) VALUES (?)", [posX])
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
    const { userAction_id, posX } = data;
  
    return db.execute("UPDATE userAction SET posX = ? WHERE userAction_id = ?", [posX, userAction_id])
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

  
}

module.exports = UserActionModel;
