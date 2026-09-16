<?php
declare(strict_types=1);
require_once __DIR__ . '/app/bootstrap.php';
$v = htmlspecialchars(vibe_version());
?>
<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><title>Vibe Mundo Virtual</title><link rel="stylesheet" href="assets/css/world.css?v=<?= $v ?>"></head><body>
<main class="game">
<header class="hud"><div class="profile"><div class="portrait">🧑🏻</div><div><strong>Avatar</strong><small>Nível 1</small><div class="xp"><i></i><span>120 / 500 XP</span></div></div></div><div class="wallet"><b>🪙 50</b><b>💎 0</b></div><nav><button id="inventoryBtn">🎒<span>Inventário</span></button><button id="avatarBtn">🧑<span>Avatar</span></button><button id="missionsBtn">📜<span>Missões</span></button><button id="rankingBtn">🏆<span>Ranking</span></button></nav></header>
<section class="viewport" id="scene" tabindex="0" aria-label="Praça Central do Mundo Virtual">
<div class="world" id="world">
<div class="grass g1"></div><div class="grass g2"></div><div class="street main-street"></div><div class="street cross-street"></div>
<div class="fountain obstacle"><div class="water">⛲</div></div>
<div class="garden garden1 obstacle">🌷🌿🌼🌿🌷</div><div class="garden garden2 obstacle">🌿🌻🌿🌺🌿</div>
<div class="bench b1 obstacle">🪑</div><div class="bench b2 obstacle">🪑</div><div class="lamp l1 obstacle">💡</div><div class="lamp l2 obstacle">💡</div><div class="lamp l3 obstacle">💡</div><div class="tree t1 obstacle">🌳</div><div class="tree t2 obstacle">🌳</div><div class="tree t3 obstacle">🌳</div>
<button class="building tech obstacle" data-shop="Tech World"><div class="roof"></div><div class="sign">💻 Tech World<small>Eletrônicos</small></div><div class="windows">▣　▣</div><div class="door">▥</div></button>
<button class="building jp obstacle" data-shop="Loja JP"><div class="roof striped"></div><div class="sign">🛍️ Loja JP<small>Produtos diversos</small></div><div class="windows">▣　▣</div><div class="door">▥</div></button>
<button class="building fashion obstacle" data-shop="Vibe Fashion"><div class="roof"></div><div class="sign">👕 Vibe Fashion<small>Moda</small></div><div class="windows">▣　▣</div><div class="door">▥</div></button>
<button class="building style obstacle" data-shop="Vibe Style"><div class="roof striped"></div><div class="sign">✨ Vibe Style<small>Itens virtuais</small></div><div class="windows">▣　▣</div><div class="door">▥</div></button>
<div class="npc n1 obstacle">🧑🏾‍🦱<span>Olá!</span></div><div class="npc n2 obstacle">👩🏻‍🦰</div><div class="npc n3 obstacle">👨🏻‍🦳</div>
<div class="player" id="player"><div class="avatar">🧑🏻</div><b>Você</b></div>
</div>
<div class="location">Praça Central <span>☀️</span></div><div class="minimap"><b>Mapa</b><div>🏪　⛲　🏬<br>　　🔵<br>🛍️　　　✨</div></div>
<div class="quests"><strong>Missões Ativas</strong><p>📍 Explore a cidade <b id="exploreProgress">0/3</b></p><p>🛍️ Conheça a Loja JP <b id="jpProgress">0/1</b></p></div>
<div class="controls">🖱️ Clique/toque no chão para andar<br><small>WASD / setas também funcionam</small></div>
<div class="interaction" id="interaction" hidden><strong id="interactionText">Loja próxima</strong><button type="button" id="interactBtn">Entrar</button></div>
<aside class="shop-panel" id="shopPanel" hidden><div class="panel-head"><div><h2 id="shopTitle">Loja</h2><p>Vitrine da loja</p></div><button id="closeShop">Voltar à praça</button></div><div class="products" id="products"></div></aside>
</section>
<footer><span id="status">Clique em qualquer ponto livre da praça para caminhar.</span><a href="superadmin/updates.php">Super Admin</a></footer>
</main><script src="assets/js/world.js?v=<?= $v ?>"></script></body></html>