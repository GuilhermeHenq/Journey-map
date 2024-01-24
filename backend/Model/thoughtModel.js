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

  insertThough(data) {
    if (data.posX !== undefined) {
      const { posX } = data;
      return db.execute("INSERT INTO thought (posX) VALUES (?)", [posX])
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
    const { thought_id, posX } = data;
  
    return db.execute("UPDATE thought SET posX = ? WHERE thought_id = ?", [posX, thought_id])
      .then(() => true)
      .catch((error) => {
        console.error("Error updating thought:", error);
        throw error;
      });
  }
  

  
}

module.exports = ThoughtModel;
