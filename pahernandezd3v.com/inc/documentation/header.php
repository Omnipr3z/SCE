<?php
$subtitle = '';
$current_doc_page = isset($routePath[1]) ? $routePath[1] : 'index';

// Find plugin name for subtitle
if ($current_doc_page !== 'index' && isset($dataDoc['plugins'])) {
    foreach ($dataDoc['plugins'] as $plugin) {
        if ($plugin['uid'] === $current_doc_page) {
            $subtitle = $plugin['name'];
            break;
        }
    }
}
?>


    <h2>DOCUMENTATION SCE<?php if ($subtitle): ?>
        <small><?php echo htmlspecialchars($subtitle); ?></small>
    <?php endif; ?></h2>



