<?php
require_once 'db.php';

class thoughtModel {
    public function getAllItems() {
        global $conn;
        $query = "SELECT * FROM thought";
        $result = $conn->query($query);

        $contacts = [];

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $contacts[] = $row;
            }
        }

        echo json_encode($contacts);
    }

    public function insertthought($data) {
        global $conn;
    
        // Certifique-se de que $data contenha os campos necessários antes da inserção
        if (isset($data['posX'])) {
            $posX = $data['posX'];
            $linePos = $data['linePos'] ?? 0; // Defina um valor padrão se 'linePos' não estiver presente
    
            // Execute a instrução SQL para inserção
            $query = "INSERT INTO thought (posX, linePos) VALUES (?, ?)";
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
    
    public function updatethought($data) {
        global $conn;
        $thoughtId = $data['thought_id'];
        $posX = $data['posX'];
        // Aqui você pode adicionar outros campos que precisam ser atualizados
    
        $query = "UPDATE thought SET posX = ? WHERE thought_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ii", $posX, $thoughtId);
    
        if ($stmt->execute()) {
            return true; // Atualização bem-sucedida
        } else {
            return false; // Falha na atualização
        }
    }
}
