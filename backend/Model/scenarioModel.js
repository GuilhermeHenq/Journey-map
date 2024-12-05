const db = require('./db');

class ScenarioModel {
  async createNewScenario(name, description, journeyMapId) {
    try {
      const result = await db.execute("INSERT INTO scenario (name, description, journeyMap_id) VALUES (?, ?, ?)", [name, description, journeyMapId]);
      return await this.getLastInsertedScenario(journeyMapId);
    } catch (error) {
      console.error("Error creating new scenario:", error);
      throw error;
    }
  }

  async getLastInsertedScenario(journeyMapId) {
    try {
      const [rows] = await db.query("SELECT scenario_id, name, description FROM scenario WHERE journeyMap_id = ? ORDER BY scenario_id DESC LIMIT 1", [journeyMapId]);
      if (rows.length > 0) {
        return { id: rows[0].scenario_id, name: rows[0].name, description: rows[0].description };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting last inserted scenario:", error);
      throw error;
    }
  }

  async getScenariosByJourneyMapId(journeyMapId) {
    try {
      const [rows] = await db.query("SELECT scenario_id, name, description FROM scenario WHERE journeyMap_id = ?", [journeyMapId]);
      if (rows.length > 0) {
        const scenario = rows[0];
        return { id: scenario.scenario_id, name: scenario.name, description: scenario.description };
      } else {
        return null; // Se não houver cenários, retorne null
      }
    } catch (error) {
      console.error("Error getting scenarios by journeyMapId:", error);
      throw error;
    }
  }


  async updateScenario(journeyMapId, newName, newDescription) {
    try {
      console.log("Updating scenario in database:", { journeyMapId, newName, newDescription });
      const result = await db.execute(
        "UPDATE scenario SET name = ?, description = ? WHERE journeyMap_id = ?", 
        [newName, newDescription, journeyMapId]
      );
      console.log("SQL update result:", result);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error updating scenario:", error);
      throw error;
    }
  }
  

}

module.exports = ScenarioModel;
