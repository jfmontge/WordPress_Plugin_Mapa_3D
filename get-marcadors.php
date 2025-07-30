<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

$host = 'hl1433.dinaserver.com';
$db = 'wp_c0099d5f12224cfc';
$user = 'wp-c0099d5f12224';                
$pass = 'Motocros9000_'; 

// Connecta amb la base de dades
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de connexió: ' . $conn->connect_error]);
    exit;
}

$conn->set_charset("utf8mb4");

// Consulta SQL
$sql = "SELECT nom_edificacio_historica, lat_edificacio_historica, long_edificacio_historica, imatge_edificacio_historica, descripcio_edificacio_historica, enllac_edificacio_historica  FROM edificacions_historiques;";
$result = $conn->query($sql);
if (!$result) {
    http_response_code(500);
    echo json_encode(['error' => 'Error a la consulta: ' . $conn->error]);
    exit;
}

// Recull les dades i les mostra com a JSON
$marcadors = [];

while ($row = $result->fetch_assoc()) {
    // Codifica la imatge en base64 si existeix
    if (!is_null($row['imatge_edificacio_historica'])) {
        $row['imatge_edificacio_historica'] = base64_encode($row['imatge_edificacio_historica']);
    }
    $marcadors[] = $row;
}

// Mostra el JSON
echo json_encode($marcadors);

// Tanca la connexió
$conn->close();
?>
