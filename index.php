<?php
declare(strict_types=1);
require_once __DIR__ . '/app/bootstrap.php';
?>
<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Vibe Mundo Virtual</title>
<link rel="stylesheet" href="assets/css/world.css">
</head>
<body>
<main class="world-app">
<header class="hud"><div><strong>Vibe Mundo Virtual</strong><span>Versão <?= htmlspecialchars(vibe_version()) ?></span></div>
<div class="hud-stats"><span>⭐ Nível 1</span><span>XP 120</span><span>🪙 50</span></div></header>
<section class="world-shell"><div class="scene" id="scene" tabindex="0" aria-label="Praça Central do Mundo Virtual">
<div class="road road-horizontal"></div><div class="road road-vertical"></div>
<div class="square"><div class="square-icon">⛲</div><strong>Praça Central</strong><small>Centro do Mundo Virtual</small></div>
<button class="shop shop-1" data-shop="Tech World"><span>💻</span><strong>Tech World</strong><small>Eletrônicos</small></button>
<button class="shop shop-2" data-shop="Vibe Fashion"><span>👕</span><strong>Vibe Fashion</strong><small>Roupas</small></button>
<button class="shop shop-3" data-shop="Loja JP"><span>🛍️</span><strong>Loja JP</strong><small>Produtos diversos</small></button>
<button class="shop shop-4" data-shop="Vibe Style"><span>✨</span><strong>Vibe Style</strong><small>Itens virtuais</small></button>
<div class="player" id="player"><div class="player-avatar">🧑</div><span>Você</span></div>
<div class="instructions">Clique ou toque no chão para andar • <kbd>WASD</kbd> e setas continuam disponíveis</div>
<aside class="shop-panel" id="shopPanel" hidden><div class="panel-head"><div><h2 id="shopTitle">Loja</h2><p>Vitrine da loja</p></div><button type="button" id="closeShop">Voltar</button></div><div class="products" id="products"></div></aside>
</div></section>
<nav class="actions"><button id="inventoryBtn">🎒 Inventário</button><button id="avatarBtn">🧑 Avatar</button><button id="missionsBtn">🎯 Missões</button><button id="rankingBtn">🏆 Ranking</button></nav>
<p class="status" id="status" aria-live="polite">Você está na Praça Central. Clique em um ponto do mapa para caminhar até ele.</p>
</main><script src="assets/js/world.js"></script></body></html>
