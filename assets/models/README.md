# Biblioteca 3D — Vibe Mundo Virtual

Este diretório receberá os assets GLB/GLTF reais do Mundo Virtual.

Estrutura planejada:

- `characters/` — avatar base, NPCs e animações (idle, walk, run, interact)
- `buildings/` — módulos de lojas e fachadas
- `environment/` — árvores, bancos, postes, fonte, jardins e decoração
- `items/` — itens virtuais que podem ser equipados no avatar

## Regras

- Preferir GLB otimizado para web.
- Texturas comprimidas e tamanhos adequados a dispositivos móveis.
- Não incluir assets sem licença compatível com uso comercial.
- O personagem deve possuir rig/esqueleto para animação.
- Lojas precisam manter pontos de interação/entrada independentes do mesh visual.
- Colisão e pathfinding permanecem definidos pelo motor, não pela geometria visual do modelo.

A praça procedural atual funciona como fallback enquanto os modelos definitivos são introduzidos gradualmente.
