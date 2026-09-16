# Instalação inicial na Hostinger

1. Faça backup da instalação atual.
2. Extraia o projeto no diretório escolhido, por exemplo `public_html/mundo-virtual/`.
3. Copie `config/config.example.php` para `config/config.php`.
4. Crie `config/superadmin.local.php` com uma chave forte.
5. O repositório oficial já está configurado como `semplicio/Vibe-Mundo-Virtual`.
6. Confirme PHP 8.1+ e extensão ZipArchive.
7. Acesse `/mundo-virtual/`.
8. Acesse `/mundo-virtual/superadmin/updates.php` e informe a chave local.

## Publicação de uma nova versão

- Atualize o arquivo `VERSION`.
- Atualize `update-manifest.json`.
- Faça commit/push para a branch `main`.
- No Super Admin da hospedagem, clique em verificar/instalar.

Em uma fase posterior adicionaremos releases assinados, migrações de banco, rollback completo e canais stable/beta.
