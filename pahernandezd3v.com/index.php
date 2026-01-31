<?php
define('BASE_URL', '/');
// Initialisation du routeur
$routePath = [];

if (isset($_GET['_url'])) {
    // Nettoyage de l'URL et séparation des chemins
    $url = trim(parse_url($_GET['_url'], PHP_URL_PATH), '/');
    $routePath = explode('/', $url);

    // Nettoyage pour enlever les segments vides potentiels
    $routePath = array_values(array_filter($routePath));
    
    // On retire la variable _url de GET pour ne pas polluer les autres traitements
    unset($_GET['_url']);
}
?>
<!DOCTYPE html>
<html lang="fr">
<?php include 'inc/head.php'; ?>
<body>
    <?php include 'inc/header.php'; ?>

    <main>
        <?php include 'inc/main.php'; ?>
    </main>

    <?php include 'inc/footer.php'; ?>

    <div id="pixelModal" class="modal">
        <div class="modal-content pixel-hud">
            <div class="modal-color">
                <span class="close-btn">&times;</span>
                <div id="modal-body">
                    <!-- Formulaire généré dynamiquement ici -->
                </div>
            </div>
        </div>
    </div>
    <script src="https://kit.fontawesome.com/2bcc14d52b.js" crossorigin="anonymous"></script>
    <script src="<?php echo BASE_URL; ?>assets/js/carousel.js"></script>
    <script src="<?php echo BASE_URL; ?>assets/js/modal.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script>hljs.highlightAll();</script>
</body>
</html>
