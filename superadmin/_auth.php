<?php
declare(strict_types=1);

$localFile = VIBE_ROOT . '/config/superadmin.local.php';
$local = is_file($localFile) ? require $localFile : [];
$expected = (string)($local['update_key'] ?? '');

if ($expected === '') {
    http_response_code(503);
    exit('Atualizador bloqueado: configure config/superadmin.local.php no servidor.');
}

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_key'])) {
    if (hash_equals($expected, (string)$_POST['update_key'])) {
        session_regenerate_id(true);
        $_SESSION['vibe_superadmin_update'] = true;
    }
}

if (empty($_SESSION['vibe_superadmin_update'])) {
    ?>
    <!doctype html>
    <html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Super Admin</title><style>
    body{font-family:system-ui;background:#0d1017;color:#f4f5f7;margin:0;padding:30px}
    form{max-width:430px;margin:60px auto;background:#171b24;padding:24px;border:1px solid #343b48;border-radius:18px}
    input,button{width:100%;box-sizing:border-box;padding:12px;margin-top:10px;border-radius:10px;border:1px solid #3b4352}
    button{cursor:pointer}
    </style></head><body><form method="post"><h1>Super Admin</h1>
    <p>Informe a chave local para acessar o atualizador.</p>
    <input type="password" name="update_key" required autocomplete="current-password">
    <button type="submit">Entrar</button></form></body></html>
    <?php
    exit;
}

if (empty($_SESSION['vibe_update_csrf'])) {
    $_SESSION['vibe_update_csrf'] = bin2hex(random_bytes(32));
}
