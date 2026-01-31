<?php
session_start(); // Démarre la session

header("Content-Type: application/json");

// Simule une base de données (à remplacer par une vraie connexion SQL)
$users = [
    "admin" => "Admin",
    "player1" => "Mird192515$$"
];

// Vérifie si l'utilisateur est déjà logué
if (isset($_SESSION['username'])) {
    echo json_encode(["success" => true, "message" => "Vous êtes déjà logué."]);
    exit;
}

// Récupération des données POST
$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

// Vérification des identifiants
if (isset($users[$username]) && $users[$username] === $password) {
    // Enregistre l'utilisateur dans la session
    $_SESSION['username'] = $username;

    echo json_encode(["success" => true, "message" => "Connexion réussie !"]);
} else {
    echo json_encode(["success" => false, "message" => "Identifiants incorrects."]);
}
?>
