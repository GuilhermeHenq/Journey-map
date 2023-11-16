<?php
require_once '../model/thoughtModel.php';

class thoughtController {
    public function getAllItems() {
        $mapModel = new thoughtModel();
        $mapModel->getAllItems();
    }

    public function postAllItems() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Receba os dados do corpo da solicitação POST
            $postData = json_decode(file_get_contents('php://input'), true);
    
            if ($postData) {
                // Valide os dados recebidos, certificando-se de que contém os campos necessários
                if (isset($postData['posX'])) {
                    // Crie uma instância do modelo de contato (substitua com o modelo real)
                    $thoughtModel = new thoughtModel();
    
                    // Prepare os dados a serem inseridos no banco de dados
                    $dataToInsert = ['posX' => $postData['posX']];
    
                    if (isset($postData['lineY'])) {
                        $dataToInsert['lineY'] = $postData['lineY'];
                    }
    
                    // Chame o método do modelo para inserir os dados no banco de dados
                    $success = $thoughtModel->insertthought($dataToInsert);
    
                    if ($success) {
                        // Dados inseridos com sucesso, retorne uma resposta de sucesso
                        http_response_code(201); // Código de status "Created"
                        echo json_encode(['message' => 'Dados inseridos com sucesso']);
                    } else {
                        // Falha ao inserir dados, retorne uma resposta de erro
                        http_response_code(500); // Código de status "Internal Server Error"
                        echo json_encode(['error' => 'Erro ao inserir dados']);
                    }
                } else {
                    // Dados de solicitação POST ausentes ou inválidos, retorne uma resposta de erro
                    http_response_code(400); // Código de status "Bad Request"
                    echo json_encode(['error' => 'Dados de solicitação POST ausentes ou inválidos']);
                }
            } else {
                // Falha ao decodificar os dados POST, retorne uma resposta de erro
                http_response_code(400); // Código de status "Bad Request"
                echo json_encode(['error' => 'Falha ao decodificar os dados POST']);
            }
        } else {
            // Método de solicitação inválido, retorne uma resposta de erro
            http_response_code(405); // Código de status "Method Not Allowed"
            echo json_encode(['error' => 'Método de solicitação inválido']);
        }
    }
    
    public function updateAllItems() {
        if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
            $putData = json_decode(file_get_contents('php://input'), true);
            
            if ($putData && isset($putData['thought_id'])) {
                $thoughtModel = new thoughtModel();
                $success = $thoughtModel->updatethought($putData);
    
                if ($success) {
                    http_response_code(200); // Código de status "OK"
                    echo json_encode(['message' => 'Dados atualizados com sucesso']);
                } else {
                    http_response_code(500); // Código de status "Internal Server Error"
                    echo json_encode(['error' => 'Erro ao atualizar os dados']);
                }
            } else {
                http_response_code(400); // Código de status "Bad Request"
                echo json_encode(['error' => 'Dados de solicitação PUT ausentes ou inválidos']);
            }
        } else {
            http_response_code(405); // Código de status "Method Not Allowed"
            echo json_encode(['error' => 'Método de solicitação inválido']);
        }
    }
    
}
?>
