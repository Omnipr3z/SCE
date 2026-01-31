<?php
$doc_page_uid = isset($routePath[1]) ? $routePath[1] : 'index';

$file_to_include = __DIR__ . '/' . $doc_page_uid . '.php';
?>

<div class="doc-main-inner">
    <?php
    if (file_exists($file_to_include)) {
        include $file_to_include;
    } else {
        // If the specific doc doesn't exist, show the index.
        include __DIR__ . '/index.php';
    } ?>
</div>

<div class="doc-main-right">
    <iframe
        class="youtube-box"
        width="640"
        height="360"
        src="https://www.youtube-nocookie.com/embed/AKjL9qQOL20?si=1ywj5J0jRbNyr1Hz"
        title="Video Youtube"
        frameborder="0"
        allow="accelerometer;
            autoplay;
            clipboard-write;
            encrypted-media;
            gyroscope;
            picture-in-picture;
            web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen>
    </iframe>

    <h3>Besoin d'aide ?</h3>
    <p>Vous avez des questions ou besoin d'aide ? Rejoignez notre
        <a href="https://discord.gg/your-discord-link" target="_blank" rel="noopener">
            serveur Discord
        </a>
    </p>
</div>