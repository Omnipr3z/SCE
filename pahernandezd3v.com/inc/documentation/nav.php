
    
<div class="doc-sidebar-inner">
    <ul>
        <li>
            <a href="<?php echo BASE_URL; ?>documentation" class="<?php echo ($current_doc_page === 'index') ? 'active' : ''; ?>">
                Introduction
            </a>
        </li>
        <hr>
        <?php if(isset($dataDoc['plugins'])): ?>
            <?php foreach ($dataDoc['plugins'] as $plugin): ?>
                <li>
                    <a href="<?php echo BASE_URL; ?>documentation/<?php echo $plugin['uid']; ?>" 
                        class="<?php echo ($current_doc_page === $plugin['uid']) ? 'active' : ''; ?>">
                        <?php echo htmlspecialchars($plugin['name']); ?>
                    </a>
                </li>
            <?php endforeach; ?>
        <?php endif; ?>
    </ul>
</div>