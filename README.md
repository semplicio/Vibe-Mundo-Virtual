# Vybe B&S — E-commerce

Loja virtual em PHP e MySQL com catálogo, carrinho, pedidos, área do cliente,
painel administrativo e provador virtual com avatar 3D.

## Atualização administrativa

O painel `admin/atualizacoes.php` consulta `update-manifest.json`, baixa o pacote
publicado na versão do GitHub, valida o SHA-256, cria um backup preventivo e
instala os novos arquivos.

As atualizações preservam:

- `config/database.php`;
- `config/superadmin.local.php`;
- `storage/`;
- `uploads/`.

Nunca publique credenciais reais. Use `config/database.example.php` como modelo.

## Hospedagem

Na primeira instalação, extraia o pacote da Hostinger dentro de `public_html`.
Depois disso, novas versões podem ser instaladas em **Painel administrativo →
Atualizações**.
