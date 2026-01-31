<?php
// Définition du chemin vers les pages
$pagesPath = __DIR__ . '/pages/';

// Route par défaut
$pageToInclude = $pagesPath . 'home.php';

// Si une route est demandée
// on verifie que $routePath est un tableau et qu'il n'est pas vide
if (is_array($routePath) && !empty($routePath) && isset($routePath[0]) && !empty($routePath[0])) {
    $requestedPage = $pagesPath . htmlspecialchars($routePath[0]) . '.php';
    // Si la page demandée existe, on la charge
    if (file_exists($requestedPage)) {
        $pageToInclude = $requestedPage;
    } else {
        // Sinon, on charge la page 404
        $pageToInclude = $pagesPath . '404.php';
    }
}

// Inclusion de la page
include $pageToInclude;
?>
