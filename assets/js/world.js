(() => {
    'use strict';

    const scene = document.getElementById('scene');
    const player = document.getElementById('player');
    const panel = document.getElementById('shopPanel');
    const title = document.getElementById('shopTitle');
    const products = document.getElementById('products');
    const status = document.getElementById('status');

    if (!scene || !player || !panel || !title || !products || !status) return;

    let x = 50;
    let y = 64;

    const catalog = {
        'Tech World': [
            ['⌚', 'Smart Watch', 'R$ 399,90'],
            ['📱', 'Smartphone', 'R$ 1.299,90'],
            ['🎧', 'Fone Wireless', 'R$ 149,90']
        ],
        'Vibe Fashion': [
            ['🧢', 'Boné Urban', 'R$ 59,90'],
            ['👕', 'Camiseta Vibe', 'R$ 89,90'],
            ['👟', 'Tênis Street', 'R$ 219,90']
        ],
        'Loja JP': [
            ['🎒', 'Bag Premium', 'R$ 129,90'],
            ['⌚', 'Relógio Classic', 'R$ 199,90'],
            ['🕶️', 'Óculos Style', 'R$ 79,90']
        ],
        'Vibe Style': [
            ['🧢', 'Boné Neon Virtual', 'R$ 4,90'],
            ['✨', 'Aura Dourada', 'R$ 7,90'],
            ['🕶️', 'Óculos Cyber', 'R$ 5,90']
        ]
    };

    function renderPlayer() {
        player.style.left = `${x}%`;
        player.style.top = `${y}%`;
    }

    function move(dx, dy) {
        x = Math.max(7, Math.min(93, x + dx));
        y = Math.max(8, Math.min(90, y + dy));
        renderPlayer();
        status.textContent = 'Você está explorando o Mundo Virtual.';
    }

    function openShop(name) {
        title.textContent = name;
        products.replaceChildren();

        (catalog[name] || []).forEach(([icon, productName, price]) => {
            const card = document.createElement('article');
            card.className = 'product';

            const iconEl = document.createElement('div');
            iconEl.className = 'product-icon';
            iconEl.textContent = icon;

            const nameEl = document.createElement('div');
            nameEl.className = 'product-name';
            nameEl.textContent = productName;

            const priceEl = document.createElement('div');
            priceEl.className = 'product-price';
            priceEl.textContent = price;

            const action = document.createElement('button');
            action.type = 'button';
            action.textContent = name === 'Vibe Style' ? 'Adicionar ao avatar' : 'Ver produto';
            action.addEventListener('click', () => {
                status.textContent = name === 'Vibe Style'
                    ? `${productName} foi adicionado ao inventário virtual (protótipo).`
                    : `Produto selecionado: ${productName}.`;
            });

            card.append(iconEl, nameEl, priceEl, action);
            products.appendChild(card);
        });

        panel.hidden = false;
        status.textContent = `Você entrou na ${name}.`;
    }

    document.querySelectorAll('.shop').forEach((button) => {
        button.addEventListener('click', () => openShop(button.dataset.shop));
    });

    document.getElementById('closeShop')?.addEventListener('click', () => {
        panel.hidden = true;
        status.textContent = 'Você voltou para a cidade.';
        scene.focus();
    });

    scene.addEventListener('keydown', (event) => {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

        const key = event.key.toLowerCase();
        if (key === 'arrowup' || key === 'w') {
            event.preventDefault();
            move(0, -4);
        } else if (key === 'arrowdown' || key === 's') {
            event.preventDefault();
            move(0, 4);
        } else if (key === 'arrowleft' || key === 'a') {
            event.preventDefault();
            move(-4, 0);
        } else if (key === 'arrowright' || key === 'd') {
            event.preventDefault();
            move(4, 0);
        }
    });

    document.getElementById('inventoryBtn')?.addEventListener('click', () => {
        status.textContent = 'Inventário: nenhum item persistido ainda. A próxima etapa ligará o inventário à conta do usuário.';
    });

    document.getElementById('avatarBtn')?.addEventListener('click', () => {
        status.textContent = 'Avatar: modelo inicial. A próxima etapa criará o sistema real de aparência e equipamentos.';
    });

    document.getElementById('missionsBtn')?.addEventListener('click', () => {
        status.textContent = 'Missão inicial: visite 3 lojas para completar a primeira missão do protótipo.';
    });

    document.getElementById('rankingBtn')?.addEventListener('click', () => {
        status.textContent = 'Ranking: sistema ainda local no protótipo. Será conectado à API posteriormente.';
    });

    renderPlayer();
    scene.focus();
})();
