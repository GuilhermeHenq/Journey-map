// contactPointModel.js

const db = require('./db'); // Certifique-se de que o arquivo db.js está configurado corretamente

class ContactPointModel {
  getAllItems() {
    return db.query("SELECT * FROM contactpoint")
      .then(([rows]) => {
        return rows.map(row => ({
          contactPoint_id: row.contactPoint_id,
          journeyMap_id: row.journeyMap_id,
          linePos: row.linePos,
          posX: row.posX,
          length: row.length,
          description: row.description,
          emojiTag: row.emojiTag
        }));
      })
      .catch((error) => {
        console.error("Error fetching contact points:", error);
        throw error;
      });
  }

  insertContactPoint(data) {
    return new Promise((resolve, reject) => {
      // Certifique-se de que data contenha os campos necessários antes da inserção
      if (data.posX !== undefined) {
        const { posX, linePos = 0 } = data; // Defina um valor padrão para 'linePos' se não estiver presente

        // Execute a instrução SQL para inserção
        const query = "INSERT INTO contactpoint (posX, linePos) VALUES (?, ?)";
        db.query(query, [posX, linePos])
          .then(() => {
            resolve(true); // Inserção bem-sucedida
          })
          .catch(error => {
            reject(error); // Falha na inserção
          });
      } else {
        reject('Campos necessários ausentes'); // Campos necessários ausentes
      }
    });
  }

  updateContactPoint(data) {
    return new Promise((resolve, reject) => {
      const { contactPoint_id, posX } = data;

      // Execute a instrução SQL para atualização
      const query = "UPDATE contactpoint SET posX = ? WHERE contactPoint_id = ?";
      db.query(query, [posX, contactPoint_id])
        .then(() => {
          resolve(true); // Atualização bem-sucedida
        })
        .catch(error => {
          reject(error); // Falha na atualização
        });
    });
  }
}

module.exports = ContactPointModel;
