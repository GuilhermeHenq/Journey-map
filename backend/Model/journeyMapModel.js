// journeyMapModel.js
const db = require('./db');

class JourneyMapModel {
  createNewMap(userId, mapName) {
    return db.execute("INSERT INTO journeyMap (map_name, user_id) VALUES (?, ?)", [mapName, userId])
      .then(() => {
        return this.getLastInsertedMap(userId);
      })
      .catch((error) => {
        console.error("Error creating new journey map:", error);
        throw error;
      });
  }

  getLastInsertedMap(userId) {
    return db.query("SELECT journeyMap_id, map_name FROM journeyMap WHERE user_id = ? ORDER BY journeyMap_id DESC LIMIT 1", [userId])
      .then(([rows]) => {
        if (rows.length > 0) {
          return { id: rows[0].journeyMap_id, name: rows[0].map_name };
        } else {
          return null;
        }
      })
      .catch((error) => {
        console.error("Error getting last inserted map:", error);
        throw error;
      });
  }

  getUserMaps(userId) {
    return db.query("SELECT journeyMap_id, map_name FROM journeyMap WHERE user_id = ?", [userId])
      .then(([rows]) => {
        const maps = rows.map(row => ({ id: row.journeyMap_id, name: row.map_name }));
        return maps;
      })
      .catch((error) => {
        console.error("Error getting user maps:", error);
        throw error;
      });
  }

  async updateMapName(journeyMapId, newName) {
    try {
      const result = await db.execute("UPDATE journeyMap SET map_name = ? WHERE journeyMap_id = ?", [newName, journeyMapId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error updating map name:", error);
      throw error;
    }
  }

  async deleteMap(journeyMapId) {
    try {
      const result = await db.execute("DELETE FROM journeyMap WHERE journeyMap_id = ?", [journeyMapId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error deleting user maps:", error);
      throw error;
    }
  }
}

module.exports = JourneyMapModel;
