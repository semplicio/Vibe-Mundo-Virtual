<?php
declare(strict_types=1);

define('VIBE_ROOT', dirname(__DIR__));

$configFile = VIBE_ROOT . '/config/config.php';
$exampleFile = VIBE_ROOT . '/config/config.example.php';

$config = is_file($configFile)
    ? require $configFile
    : require $exampleFile;

require_once VIBE_ROOT . '/app/Core/Updater.php';

function vibe_config(?string $section = null): array
{
    global $config;
    if ($section === null) {
        return $config;
    }
    return $config[$section] ?? [];
}

function vibe_version(): string
{
    $file = VIBE_ROOT . '/VERSION';
    return is_file($file) ? trim((string) file_get_contents($file)) : '0.0.0';
}
