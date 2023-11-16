<?php
require_once 'db.php';

class MapModel {
    public function getAllItems() {
        global $conn;
        $query = "SELECT * FROM map";
        $result = $conn->query($query);

        $maps = [];

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $maps[] = $row;
            }
        }

        echo json_encode($maps);
    }
}
