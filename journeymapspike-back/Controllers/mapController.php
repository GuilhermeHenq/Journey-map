<?php
require_once '../Model/mapModel.php';

class MapController {
    public function getAllItems() {
        $mapModel = new MapModel();
        $mapModel->getAllItems();
    }
}
