<?php
require_once 'db.php';

class userActionModel {
    public function getAllItems() {
        global $conn;
        $query = "SELECT * FROM userAction";
        $result = $conn->query($query);

        $contacts = [];

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $contacts[] = $row;
            }
        }

        echo json_encode($contacts);
    }

    public function insertuserAction($data) {
        global $conn;
    
        // Certifique-se de que $data contenha os campos necessários antes da inserção
        if (isset($data['posX'])) {
            $posX = $data['posX'];
            $linePos = $data['linePos'] ?? 0; // Defina um valor padrão se 'linePos' não estiver presente
    
            // Execute a instrução SQL para inserção
            $query = "INSERT INTO userAction (posX, linePos) VALUES (?, ?)";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("dd", $posX, $linePos);
    
            if ($stmt->execute()) {
                return true; // Inserção bem-sucedida
            } else {
                return false; // Falha na inserção
            }
        } else {
            return false; // Campos necessários ausentes
        }
    }
    
    public function updateuserAction($data) {
        global $conn;
        $userActionId = $data['userAction_id'];
        $posX = $data['posX'];
        // Aqui você pode adicionar outros campos que precisam ser atualizados
    
        $query = "UPDATE userAction SET posX = ? WHERE userAction_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ii", $posX, $userActionId);
    
        if ($stmt->execute()) {
            return true; // Atualização bem-sucedida
        } else {
            return false; // Falha na atualização
        }
    }
}
