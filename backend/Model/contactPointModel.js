// contactpointModel.js

const db = require('./db');

class ContactPointModel {
  getAllItems() {
    return db.query("SELECT * FROM contactpoint")
      .then(([rows]) => {
        return rows;
      })
      .catch((error) => {
        console.error("Error fetching contactpoints:", error);
        throw error;
      });
  }

  insertContactPoint(data) {
    if (data.posX !== undefined) {
      const { posX } = data;
      return db.execute("INSERT INTO contactpoint (posX) VALUES (?)", [posX])
        .then(() => true)
        .catch((error) => {
          console.error("Error inserting contactpoint:", error);
          throw error;
        });
    } else {
      return Promise.resolve(false);
    }
  }
  

  updateContactPoint(data) {
    const { contactPoint_id, posX } = data;
  
    return db.execute("UPDATE contactpoint SET posX = ? WHERE contactPoint_id = ?", [posX, contactPoint_id])
      .then(() => true)
      .catch((error) => {
        console.error("Error updating contactpoint:", error);
        throw error;
      });
  }
  

  
}

module.exports = ContactPointModel;
