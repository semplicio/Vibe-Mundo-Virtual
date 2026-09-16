<?php
declare(strict_types=1);

return [
    'app' => [
        'name' => 'Vibe Mundo Virtual',
        'environment' => 'production',
        'base_url' => 'https://vibebs.com.br/mundo-virtual',
    ],

    'updates' => [
        'enabled' => true,
        'repository' => 'semplicio/Vibe-Mundo-Virtual',
        'branch' => 'main',
        'manifest_path' => 'update-manifest.json',
        'github_token' => getenv('VIBE_GITHUB_TOKEN') ?: '',
        'protected_paths' => [
            'config/config.php',
            'config/superadmin.local.php',
            'storage',
            'uploads'
        ],
    ],
];
