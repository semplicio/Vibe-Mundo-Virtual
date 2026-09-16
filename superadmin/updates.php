<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/app/bootstrap.php';
require __DIR__ . '/_auth.php';

$updater = new Updater(VIBE_ROOT, vibe_config('updates'));
$message = null;
$error = null;
$check = null;

try {
    $check = $updater->check();

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['install_update'])) {
        $csrf = (string)($_POST['csrf'] ?? '');
        if (!hash_equals((string)$_SESSION['vibe_update_csrf'], $csrf)) {
            throw new RuntimeException('Sessão inválida. Atualize a página e tente novamente.');
        }

        $result = $updater->install();
        $message = $result['installed']
            ? 'Atualização instalada. Nova versão: ' . $result['version'] . '. Backup: ' . $result['backup']
            : $result['message'];

        $check = $updater->check();
    }
} catch (Throwable $e) {
    $error = $e->getMessage();
}
?>
<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Atualizações | Vibe Mundo Virtual</title>
<style>
body{font-family:system-ui;background:#0d1017;color:#f4f5f7;margin:0;padding:24px}
main{max-width:820px;margin:auto}.card{background:#171b24;border:1px solid #343b48;border-radius:18px;padding:22px;margin-bottom:14px}
.meta{display:grid;grid-template-columns:1fr 1fr;gap:10px}.box{background:#202631;border-radius:12px;padding:14px}
button{padding:12px 16px;border:0;border-radius:10px;cursor:pointer;font-weight:700}
.ok{padding:12px;border-radius:10px;background:#173424}.err{padding:12px;border-radius:10px;background:#3a1c22}
small,p{color:#b6bdc9}@media(max-width:600px){.meta{grid-template-columns:1fr}}
</style>
</head>
<body><main>
<h1>Atualizações do sistema</h1>
<div class="card">
    <div class="meta">
        <div class="box"><small>Versão instalada</small><br><strong><?= htmlspecialchars(vibe_version()) ?></strong></div>
        <div class="box"><small>Versão no GitHub</small><br><strong><?= htmlspecialchars((string)($check['remote'] ?? 'não consultada')) ?></strong></div>
    </div>
</div>

<?php if ($message): ?><div class="ok"><?= htmlspecialchars($message) ?></div><?php endif; ?>
<?php if ($error): ?><div class="err"><?= htmlspecialchars($error) ?></div><?php endif; ?>

<div class="card">
<?php if ($check && $check['available']): ?>
    <h2>Nova atualização disponível</h2>
    <p>O sistema fará um backup dos arquivos atuais antes de instalar a nova versão.</p>
    <?php if (!empty($check['manifest']['notes'])): ?>
        <ul><?php foreach ($check['manifest']['notes'] as $note): ?><li><?= htmlspecialchars((string)$note) ?></li><?php endforeach; ?></ul>
    <?php endif; ?>
    <form method="post">
        <input type="hidden" name="csrf" value="<?= htmlspecialchars($_SESSION['vibe_update_csrf']) ?>">
        <button type="submit" name="install_update" value="1">Instalar atualização</button>
    </form>
<?php elseif ($check): ?>
    <h2>Sistema atualizado</h2>
    <p>Nenhuma versão mais recente foi encontrada no GitHub.</p>
<?php else: ?>
    <h2>GitHub ainda não vinculado</h2>
    <p>Verifique a configuração do repositório e a conectividade HTTPS do servidor.</p>
<?php endif; ?>
</div>
</main></body></html>
