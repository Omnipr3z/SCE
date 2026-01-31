<nav>
    <ul>
        <?php
            $navItemList = [
                'about' => ['À propos', '#about'],
                'documentation' => ['Documentation', '/documentation'],
                'media' => ['Captures', '#media'],
                'contact' => ['Contact', '#contact'],
                'github' => ['GitHub', 'https://github.com/Omnipr3z/SCE']
            ];
            foreach ($navItemList as $key => $item) {
                $isActive = (isset($routePath[0]) && $routePath[0] == $key[1]) ? 'class="active"' : '';
                $targetAttr = (strpos($item[1], 'http') === 0) ? 'target="_blank"' : '';
                
                
                echo "<li><a href="."\"{$item[1]}\" {$isActive} {$targetAttr}>{$item[0]}</a></li>";
            }
        ?>
    </ul>
</nav>