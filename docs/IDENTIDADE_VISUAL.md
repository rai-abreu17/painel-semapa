# Identidade visual do Painel SEMAPA

Este documento registra a revisão anterior. Para o sistema visual vigente e sua validação em 17/10/2026, consulte [Revisão visual](REVISAO_VISUAL.md).

## Diagnóstico

A inspeção do site publicado e dos componentes locais foi feita antes das alterações. Os principais problemas encontrados foram:

- Contexto da página e informações auxiliares dos KPIs disponíveis apenas em tooltips.
- Rótulos pequenos, pesos tipográficos concorrentes e valores desalinhados entre indicadores.
- Superfícies, bordas e espaçamentos diferentes na planta e no detalhe do setor.
- Grandes áreas de cor na planta competindo com os dados; separadores pontilhados e controles com pesos visuais distintos.
- Alertas independentes com três ações primárias visualmente concorrentes.
- Nome, status e explicação das restrições comprimidos na mesma linha.
- No mobile, rótulos sobrepostos no gráfico de impacto, tabelas com colunas comprimidas e contagens do histograma muito próximas.

Foram preservados a organização da navegação, os segmentos de filtros, o mapa de setores, a representação listrada dos dados suprimidos e o mecanismo existente de tooltips.

## Direção visual

A identidade mantém o azul institucional, com superfícies neutras e cores semânticas reservadas aos estados dos dados. Inter passa a organizar títulos e textos; números recebem algarismos tabulares. A família monoespaçada existente continua disponível para séries, tabelas e informações técnicas.

Os quatro KPIs compartilham uma superfície dividida, com valores alinhados, contexto visível e barras de 3 px. A planta e o detalhe formam um módulo único. As cores da planta passam a ocupar fundos suaves e marcas laterais, preservando a associação entre métrica, cor e setor. Os estados suprimidos continuam listrados.

Os alertas são linhas de uma lista, com prioridade discreta, justificativa expansível e ação contextual. Os cards de restrição mostram nome, estado, orientação e progresso. A justificativa completa de privacidade continua no tooltip correspondente.

## Organização

- `src/styles/tokens.css`: cores, fontes, espaçamentos, raios, controles, largura máxima e camadas.
- `src/styles/components.css`: primitivas compartilhadas de botões, cards, tabelas, formulários e modais.
- `src/styles/shell.css`: navegação, cabeçalho, composição global e adaptações das telas de análise.
- `src/styles/filters.css`: toolbar integrada, segmentos, seleção de setor e chips.
- `src/styles/overview.css`: KPIs agrupados, planta, detalhe, alertas e restrições.
- `kpi-stat-card.component.css`: tipografia e composição interna de cada indicador.

## Responsividade e acessibilidade

A largura máxima é de 1560 px, com navegação fixa no desktop e menu móvel existente abaixo de 1024 px. Os filtros respondem à largura real do componente por container queries. Os KPIs se reorganizam em duas colunas e o detalhe do setor passa para baixo da planta em telas intermediárias.

A geometria da planta é preservada. Em telas estreitas, a rolagem fica restrita ao mapa, com indicação de gesto e a alternativa existente de tabela. Tabelas mantêm uma largura mínima legível e rolam dentro de suas próprias regiões. Os marcos do gráfico de impacto aparecem em uma lista no celular para impedir sobreposição.

Foram mantidos link para pular ao conteúdo, foco visível, redução de movimento, contenção e retorno de foco do menu e do modal. Seleção da métrica e do setor na planta usa `aria-pressed`; controles expansíveis informam `aria-expanded` e `aria-controls`. Barras de cobertura e restrição têm descrição acessível dos valores, sem depender de cor.

O texto secundário usa `#56667a` e o texto de apoio `#5f6f82`, com contraste mínimo de 4,5:1 nas superfícies neutras utilizadas. Estados de hover, foco, seleção e desabilitado usam as primitivas compartilhadas.

## Escopo preservado

Nenhuma alteração foi feita em `dashboard.store.ts`, serviços, configuração de rotas, contratos, cálculos, estrutura dos dados, regras de supressão ou eventos de negócio. As coordenadas, dimensões e ações dos setores continuam vindo do mesmo view model. Nenhuma dependência foi adicionada.

## Verificação

- Build de produção sem erros nem avisos de orçamento.
- 98 verificações automatizadas de interface aprovadas, sem erros JavaScript no navegador.
- Oito telas verificadas em 320, 390, 768, 1024, 1280, 1440 e 1920 px, sem rolagem horizontal da página.
- Os dois mercados e as três métricas da planta verificados, com oito setores e sem sobreposição interna dos textos.
- Seleção e remoção de setor pela planta, atualização do detalhe por foco, dropdown, períodos, chips e limpeza de filtros verificados.
- Tabela da planta, três justificativas dos alertas e navegação com os filtros existentes verificados.
- Seleção de produto por teclado, tooltip de privacidade, Escape e contenção de foco do menu móvel verificados.
- Modal de acesso restrito verificado no celular: abertura, bloqueio sem justificativa, largura, contenção de foco, fechamento por Escape e retorno de foco.
- Revisão visual das oito telas em desktop e celular, além das larguras intermediárias da visão geral.

O projeto não possui uma suíte de testes unitários. A validação funcional foi feita com verificações automatizadas no navegador local, além da compilação Angular. Capturas e relatórios desta revisão ficam em `tmp/redesign`, diretório ignorado pelo Git.
