<?php
declare(strict_types=1);

final class Updater
{
    private string $root;
    private array $settings;

    public function __construct(string $root, array $settings)
    {
        $this->root = rtrim($root, DIRECTORY_SEPARATOR);
        $this->settings = $settings;
    }

    public function currentVersion(): string
    {
        $file = $this->root . '/VERSION';
        return is_file($file) ? trim((string) file_get_contents($file)) : '0.0.0';
    }

    public function check(): array
    {
        $repo = trim((string)($this->settings['repository'] ?? ''));
        $manifestPath = trim((string)($this->settings['manifest_path'] ?? 'update-manifest.json'));
        $branch = trim((string)($this->settings['branch'] ?? 'main'));

        if ($repo === '') {
            throw new RuntimeException('O repositório GitHub ainda não foi configurado.');
        }

        $url = sprintf(
            'https://raw.githubusercontent.com/%s/%s/%s',
            $repo,
            rawurlencode($branch),
            ltrim($manifestPath, '/')
        );

        $manifest = $this->requestJson($url);
        $remote = trim((string)($manifest['version'] ?? ''));

        if ($remote === '') {
            throw new RuntimeException('Manifesto remoto sem número de versão.');
        }

        return [
            'current' => $this->currentVersion(),
            'remote' => $remote,
            'available' => version_compare($remote, $this->currentVersion(), '>'),
            'manifest' => $manifest,
        ];
    }

    public function install(): array
    {
        if (!class_exists('ZipArchive')) {
            throw new RuntimeException('A extensão PHP ZipArchive é necessária para instalar atualizações.');
        }

        $repo = trim((string)($this->settings['repository'] ?? ''));
        $branch = trim((string)($this->settings['branch'] ?? 'main'));

        if ($repo === '') {
            throw new RuntimeException('O repositório GitHub ainda não foi configurado.');
        }

        $workDir = $this->root . '/storage/update';
        $backupDir = $this->root . '/storage/backups';
        $this->ensureDir($workDir);
        $this->ensureDir($backupDir);

        $stamp = gmdate('Ymd-His');
        $zipFile = $workDir . '/update-' . $stamp . '.zip';
        $extractDir = $workDir . '/extract-' . $stamp;
        $backupFile = $backupDir . '/backup-' . $this->currentVersion() . '-' . $stamp . '.zip';

        $this->createBackup($backupFile);

        $archiveUrl = sprintf(
            'https://github.com/%s/archive/refs/heads/%s.zip',
            $repo,
            rawurlencode($branch)
        );

        $this->download($archiveUrl, $zipFile);

        $zip = new ZipArchive();
        if ($zip->open($zipFile) !== true) {
            throw new RuntimeException('Não foi possível abrir o pacote de atualização.');
        }
        $this->ensureDir($extractDir);
        if (!$zip->extractTo($extractDir)) {
            $zip->close();
            throw new RuntimeException('Falha ao extrair a atualização.');
        }
        $zip->close();

        $dirs = array_values(array_filter(glob($extractDir . '/*') ?: [], 'is_dir'));
        if (count($dirs) !== 1) {
            throw new RuntimeException('Estrutura inesperada no pacote do GitHub.');
        }

        $sourceRoot = $dirs[0];
        $remoteManifest = $sourceRoot . '/update-manifest.json';
        if (!is_file($remoteManifest)) {
            throw new RuntimeException('Pacote recusado: update-manifest.json não encontrado.');
        }

        $manifest = json_decode((string) file_get_contents($remoteManifest), true);
        if (!is_array($manifest) || empty($manifest['version'])) {
            throw new RuntimeException('Pacote recusado: manifesto inválido.');
        }

        if (!version_compare((string)$manifest['version'], $this->currentVersion(), '>')) {
            return [
                'installed' => false,
                'message' => 'A versão instalada já é igual ou mais recente.',
                'backup' => basename($backupFile),
            ];
        }

        $this->copyTree($sourceRoot, $this->root, '');

        return [
            'installed' => true,
            'version' => (string)$manifest['version'],
            'backup' => basename($backupFile),
        ];
    }

    private function requestJson(string $url): array
    {
        $raw = $this->request($url);
        $data = json_decode($raw, true);
        if (!is_array($data)) {
            throw new RuntimeException('Resposta inválida do GitHub.');
        }
        return $data;
    }

    private function request(string $url): string
    {
        $headers = [
            'User-Agent: Vibe-Mundo-Virtual-Updater',
            'Accept: application/vnd.github+json'
        ];

        $token = trim((string)($this->settings['github_token'] ?? ''));
        if ($token !== '') {
            $headers[] = 'Authorization: Bearer ' . $token;
        }

        if (function_exists('curl_init')) {
            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_CONNECTTIMEOUT => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_HTTPHEADER => $headers,
            ]);
            $body = curl_exec($ch);
            $status = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
            $error = curl_error($ch);
            curl_close($ch);

            if ($body === false || $status < 200 || $status >= 300) {
                throw new RuntimeException('Falha ao consultar GitHub. HTTP ' . $status . ($error ? ': ' . $error : ''));
            }
            return (string)$body;
        }

        $context = stream_context_create([
            'http' => [
                'method' => 'GET',
                'header' => implode("\r\n", $headers),
                'timeout' => 30,
                'ignore_errors' => true,
            ]
        ]);

        $body = @file_get_contents($url, false, $context);
        if ($body === false) {
            throw new RuntimeException('Servidor sem cURL e não foi possível acessar o GitHub via HTTPS.');
        }
        return $body;
    }

    private function download(string $url, string $destination): void
    {
        $data = $this->request($url);
        if (file_put_contents($destination, $data, LOCK_EX) === false) {
            throw new RuntimeException('Não foi possível salvar o pacote de atualização.');
        }
    }

    private function createBackup(string $destination): void
    {
        $zip = new ZipArchive();
        if ($zip->open($destination, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            throw new RuntimeException('Não foi possível criar backup antes da atualização.');
        }

        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($this->root, FilesystemIterator::SKIP_DOTS),
            RecursiveIteratorIterator::LEAVES_ONLY
        );

        foreach ($iterator as $file) {
            if (!$file->isFile()) continue;

            $absolute = $file->getPathname();
            $relative = ltrim(str_replace($this->root, '', $absolute), DIRECTORY_SEPARATOR);

            if ($this->isStorageGeneratedFile($relative)) continue;

            $zip->addFile($absolute, $relative);
        }

        $zip->close();
    }

    private function copyTree(string $source, string $destination, string $relative): void
    {
        $items = scandir($source);
        if ($items === false) {
            throw new RuntimeException('Falha ao ler os arquivos da atualização.');
        }

        foreach ($items as $item) {
            if ($item === '.' || $item === '..' || $item === '.git') continue;

            $src = $source . DIRECTORY_SEPARATOR . $item;
            $rel = ltrim($relative . '/' . $item, '/');
            $dst = $destination . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $rel);

            if ($this->isProtected($rel)) continue;

            if (is_dir($src)) {
                $this->ensureDir($dst);
                $this->copyTree($src, $destination, $rel);
            } else {
                $this->ensureDir(dirname($dst));
                if (!copy($src, $dst)) {
                    throw new RuntimeException('Falha ao atualizar o arquivo: ' . $rel);
                }
            }
        }
    }

    private function isProtected(string $relative): bool
    {
        $relative = trim(str_replace('\\', '/', $relative), '/');
        foreach (($this->settings['protected_paths'] ?? []) as $protected) {
            $protected = trim(str_replace('\\', '/', (string)$protected), '/');
            if ($relative === $protected || str_starts_with($relative . '/', $protected . '/')) {
                return true;
            }
        }
        return false;
    }

    private function isStorageGeneratedFile(string $relative): bool
    {
        $relative = str_replace('\\', '/', $relative);
        return str_starts_with($relative, 'storage/backups/')
            || str_starts_with($relative, 'storage/update/');
    }

    private function ensureDir(string $dir): void
    {
        if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
            throw new RuntimeException('Não foi possível criar o diretório: ' . $dir);
        }
    }
}
