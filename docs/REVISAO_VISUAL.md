# Revisão visual — SEMAPA

Revisão de 17/10/2026. Angular 21.2 standalone e CSS próprio; nenhuma dependência adicionada.

## Resultado

- Filtros sticky sob a topbar. Mercado, período, métrica da planta e log usam o mesmo componente segmentado, com controles de 36px no desktop e 40px no mobile.
- Labels de período e setor mudam somente na apresentação. IDs, valores, chaves de renderização, callbacks e chips continuam iguais.
- Chips têm faixa de altura reservada; ativar período e setor produziu deslocamento de **0px** no conteúdo. A contagem usa os chips adicionais que já existiam; o mercado continua sendo o contexto principal, sem chip ou reset novo.
- No mobile, um `<details>` nativo reúne resumo e os mesmos controles projetados. A largura compacta usa o hook de viewport já existente; nenhuma lógica de filtro foi criada. A região recolhida passou de **273,5px para 83px**, em 390px.
- Tipografia Inter com números tabulares, mínimo de 12px, escala 12/13/14/16/20/24/32, cards e botões consistentes, foco visível e alvos de ajuda de 40px no mobile.
- KPIs compartilhados em Visão geral, Adoção, Cadastro e Impacto. Barras de KPI sem escala foram ocultadas visualmente. O delta de movimento mantém peso secundário frente ao KPI de variação.
- Sidebar com itens uniformes, tooltips dos badges e sessão auditada exibida uma vez. Indicador de camada único, preservando as explicações de privacidade.
- Restrição de setores em lista, donuts neutros, hero de margem negativa e contato do DPO em superfícies claras, anotações alinhadas, limiar de cobertura destacado e listas cadastrais reorganizadas. Histórico cadastral ocupa uma faixa própria.
- Tabelas preservam todas as colunas e oferecem rolagem com sombra nas bordas; a tabela de preços tem cabeçalho fixo e altura limitada no desktop. No mobile, os eventos de preço e de impacto ficam em legendas legíveis.

## Arquivos

| Área | Arquivos |
|---|---|
| Tokens e estilos globais | `src/styles.css`, `src/styles/tokens.css`, `src/styles/utilities.css` |
| Filtros | `src/styles/filters.css`, `src/app/shared/components/dashboard-filters/dashboard-filters.component.ts` |
| Controle segmentado | `src/app/shared/components/segmented-control/segmented-control.component.ts` (novo) |
| Shell e composição | `src/styles/shell.css`, `src/app/app.html`, `src/app/app.ts` (importação do componente) |
| Cards, badges, botões, tabelas | `src/styles/components.css` |
| KPIs e ajuda | `src/app/shared/components/kpi-stat-card/kpi-stat-card.component.ts`, respectivo `.css`, `src/app/shared/components/info-tip/info-tip.component.ts` |
| Ajustes de tela | `src/styles/overview.css`, `src/styles/analytics.css` (novo) |

`dashboard.store.ts`, configurações, rotas, dados e arquivos de dependências não foram alterados. Permanecem k = 5, dominância, cobertura de 30%, janelas, permissões e regras de acesso.

## Validação

- `npm run build`: aprovado, sem avisos de orçamento; bundle inicial de 311,95kB.
- Playwright: **230/230 checks**. Oito telas em 375, 390, 768, 1024, 1280, 1440 e 1920px, sem overflow da página nem textos visíveis abaixo de 12px.
- Controles em uma linha a partir de 1024px; áreas de ajuda de pelo menos 40px em telas compactas. Testados sticky e sua sombra, ausência de layout shift, ambos os mercados, períodos, setor, remoção e limpeza dos chips, métricas e tabela da planta, ações de setor e alertas, log, ordenação e seleção de produto por teclado.
- Expansão nativa dos filtros por teclado, Escape do menu, abertura/bloqueio do modal sem justificativa, contenção e retorno de foco. Nenhum acesso identificado foi confirmado.
- Medição de contraste dos textos visíveis por cores computadas nas oito telas, em 1440 e 390px: nenhuma falha AA encontrada. Não substitui auditoria completa com tecnologia assistiva.
- Capturas completas antes/depois das oito telas em **1440 e 390px**. Comparação dos view models serializáveis: idênticos, excluindo relógio/contador. Todos os textos analíticos originais preservados; comparação admite caixa, espaços, remoção dos banners redundantes de camada e realocação das explicações no cabeçalho.
- `git diff --check`: aprovado.
- `npm run lint`: indisponível, pois o projeto não configura esse script.
- `ng test --watch=false`: o runner encerra informando que não existem arquivos `.spec.ts` ou `.test.ts`. A validação desta revisão usa os checks reais de navegador acima.

Evidências locais, ignoradas pelo Git: [galeria antes/depois](../tmp/visual-ux/index.html), [checks](../tmp/visual-ux/verification.json), [comparação de dados/textos](../tmp/visual-ux/comparison.json). Scripts e capturas intermediárias por fase também ficam em `tmp/visual-ux/`.

## Fora do escopo

- Skeletons, novos estados vazios, bottom sheet, correção de plural dinâmico e modos de filtro por tela: não foram criados estados de negócio para essas opções.
- **Governança e privacidade, Cadastro e ocupação e Programas** continuam com a barra e seu comportamento original. A relevância de período/setor nessas telas precisa de decisão funcional futura.
- A sombra apenas quando sticky usa CSS scroll-state; navegadores sem suporte conservam o fundo sólido e a borda.

## Suspeitas preexistentes, apenas reportadas

1. `dashboard.store.ts` gera **“faltam 1 cadastros”** no texto de restrição, usando contagem dinâmica. A regra 6 impede corrigir a concordância neste escopo visual.
2. A janela de microcrédito termina em **21/08/2026**, e os demais programas exibem datas de agosto/setembro. Em **17/10/2026**, o programa em escopo ainda mostra “Abrir registro · quebra-vidro” e abre o modal. O contador usa a data já encerrada, enquanto a visibilidade deriva de `podeVer`. A regra de expiração não foi modificada; nenhum registro foi efetivamente aberto na validação.
