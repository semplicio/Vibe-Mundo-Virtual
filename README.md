# Vibe Mundo Virtual

Base inicial do ecossistema virtual da Vibe B&S.

## Atualização pelo GitHub

O projeto foi preparado para que o Super Admin possa consultar uma versão publicada no GitHub e instalar a atualização na hospedagem PHP.

### Fluxo

1. O GitHub contém a versão mais recente.
2. `update-manifest.json` informa o número da versão.
3. O Super Admin acessa `superadmin/updates.php`.
4. O sistema compara `VERSION` local com a versão remota.
5. Se houver atualização, o administrador confirma a instalação.
6. O servidor cria backup automático.
7. O pacote da branch configurada é baixado e instalado.
8. `config/config.php`, `storage/` e `uploads/` não são substituídos.

## Repositório oficial

`semplicio/Vibe-Mundo-Virtual`

## Antes do primeiro uso

Copie `config/config.example.php` para `config/config.php` na hospedagem.

Crie também `config/superadmin.local.php` somente no servidor:

```php
<?php
return [
    'update_key' => 'CRIE-UMA-CHAVE-FORTE'
];
```

Esse arquivo não deve ser enviado ao GitHub.

## Repositório privado

Se o projeto se tornar privado, não grave token do GitHub no repositório. Configure `VIBE_GITHUB_TOKEN` no servidor ou use `config/config.php`, que está ignorado pelo Git.

## Observação

A atualização automática ainda não altera banco de dados. Migrações versionadas serão adicionadas antes de começarmos a alterar o schema de produção.
