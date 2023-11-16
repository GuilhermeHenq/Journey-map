<?php
require_once 'db.php';

class emotionModel {
    public function getAllItems() {
        global $conn;
        $query = "SELECT * FROM emotion";
        $result = $conn->query($query);

        $contacts = [];

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $contacts[] = $row;
            }
        }

        echo json_encode($contacts);
    }


    public function insertemotion($data) {
        global $conn;
    
        // Certifique-se de que $data contenha os campos necessários antes da inserção
        if (isset($data['posX']) && isset($data['lineY'])) {
            $posX = $data['posX'];
            $lineY = $data['lineY'];
            $emojiTag = $data['emojiTag'];
            $journeyMapId = $data['journeyMap_id'];
    
            // Execute a instrução SQL para inserção
            $query = "INSERT INTO emotion (journeyMap_id, posX, lineY, emojiTag) VALUES (?, ?, ?, ?)";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("iidds", $journeyMapId, $posX, $lineY, $emojiTag);
    
            if ($stmt->execute()) {
                return true; // Inserção bem-sucedida
            } else {
                return false; // Falha na inserção
            }
        } else {
            return false; // Campos necessários ausentes
        }
    }
    
    public function updateemotion($data) {
        global $conn;
        $emotionId = $data['emotion_id'];
        $posX = $data['posX'];
        $lineY = $data['lineY']; // Adicione o campo lineY aqui
        
        $query = "UPDATE emotion SET posX = ?, lineY = ? WHERE emotion_id = ?"; // Atualize a consulta SQL
        $stmt = $conn->prepare($query);
        $stmt->bind_param("iii", $posX, $lineY, $emotionId); // Atualize o tipo de dados (iiii)
        
        if ($stmt->execute()) {
            return true; // Atualização bem-sucedida
        } else {
            return false; // Falha na atualização
        }
    }
    
    
}
