<?php

define('EXT_VIEW', 'html');
define('CONFIG_ENV', file_get_contents('../config.env'));
define('CONFIG_JSON', file_get_contents('../config.json'));

if (is_file(__DIR__ . './constConfigAdd.php')) include __DIR__ . './constConfigAdd.php';

?>