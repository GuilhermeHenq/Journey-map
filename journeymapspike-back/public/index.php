<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['controller'])) {
        $controller = $_GET['controller'];
        include '../Controllers/' . $controller . 'Controller.php';
        $controllerClassName = ucfirst($controller) . 'Controller';
        if (class_exists($controllerClassName)) {
            $controllerInstance = new $controllerClassName();
            if (isset($_GET['method'])) {
                $method = $_GET['method'];
                if (method_exists($controllerInstance, $method)) {
                    $controllerInstance->$method();
                } else {
                    echo json_encode(['error' => 'Método não encontrado']);
                }
            } else {
                echo json_encode(['error' => 'Método não especificado']);
            }
        } else {
            echo json_encode(['error' => 'Controlador não encontrado']);
        }
    } else {
        echo json_encode(['error' => 'Controlador não especificado']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    parse_str(file_get_contents('php://input'), $putData);
    if (isset($_GET['controller'])) {
        $controller = $_GET['controller'];
        include '../Controllers/' . $controller . 'Controller.php';
        $controllerClassName = ucfirst($controller) . 'Controller';
        if (class_exists($controllerClassName)) {
            $controllerInstance = new $controllerClassName();
            if (isset($_GET['method'])) {
                $method = $_GET['method'];
                if (method_exists($controllerInstance, $method)) {
                    $controllerInstance->$method();
                } else {
                    echo json_encode(['error' => 'Método não encontrado']);
                }
            } else if (isset($_POST['method'])) {
                $method = $_POST['method'];
                if (method_exists($controllerInstance, $method)) {
                    $controllerInstance->$method();
                } else {
                    echo json_encode(['error' => 'Método não encontrado']);
                }
            } else {
                echo json_encode(['error' => 'Método não especificado']);
            }
        } else {
            echo json_encode(['error' => 'Controlador não encontrado']);
        }
    } else {
        echo json_encode(['error' => 'Controlador não especificado']);
    }
}
